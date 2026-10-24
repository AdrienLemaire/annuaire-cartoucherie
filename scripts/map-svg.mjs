#!/usr/bin/env node
// scripts/map-svg.mjs
// Renders src/assets/quartier.svg, the /carte map: OpenStreetMap streets,
// tram, river and parks inside MAP_BOUNDS (src/lib/plan.ts), projected in the
// same Web Mercator pixels as the pins and styled by carte.astro's CSS.
// Vector and inlined, not a raster tile mosaic: a 40-80 KB image became the
// page's LCP element and pushed it past its 2 s budget, where inline SVG
// paths are no LCP candidate at all and stay sharp under pinch-zoom.
// Run by hand, only when MAP_BOUNDS changes; the SVG is committed. Never
// part of the build: one Overpass query, not one per push.
import { writeFileSync } from "node:fs";
import { MAP_BOUNDS, mercatorPixel } from "../src/lib/plan.ts";

const OUT = "src/assets/quartier.svg";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "annuaire-cartoucherie map-svg (github.com/AdrienLemaire/annuaire-cartoucherie)";
const SIMPLIFY_PX = 1.5;
const LABEL_FONT_PX = 14;
const LABEL_CHAR_PX = 7.6;

// Road class per OSM highway value: the CSS styles each class (carte.astro).
const ROAD = {
  motorway: "m",
  motorway_link: "m",
  trunk: "m",
  primary: "p",
  secondary: "p",
  tertiary: "p",
  residential: "r",
  living_street: "r",
  unclassified: "r",
  pedestrian: "r",
  service: "s",
};
const LABELLED = new Set(["p", "r"]);

const topLeft = mercatorPixel(MAP_BOUNDS.north, MAP_BOUNDS.west);
const bottomRight = mercatorPixel(MAP_BOUNDS.south, MAP_BOUNDS.east);
const W = Math.round(bottomRight.x - topLeft.x);
const H = Math.round(bottomRight.y - topLeft.y);

function project(geometry) {
  return geometry.map(({ lat, lon }) => {
    const { x, y } = mercatorPixel(lat, lon);
    return [x - topLeft.x, y - topLeft.y];
  });
}

async function fetchOsm() {
  const b = `${MAP_BOUNDS.south},${MAP_BOUNDS.west},${MAP_BOUNDS.north},${MAP_BOUNDS.east}`;
  const query = `[out:json][timeout:60];(
    way["highway"](${b});
    way["railway"="tram"](${b});
    relation["natural"="water"](${b});
    way["natural"="water"](${b});
    way["leisure"~"^(park|garden|pitch)$"](${b});
    way["landuse"~"^(grass|recreation_ground)$"](${b});
  );out geom;`;
  const response = await globalThis.fetch(OVERPASS, {
    method: "POST",
    headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!response.ok) throw new Error(`Overpass: HTTP ${response.status}`);
  return (await response.json()).elements;
}

/** Douglas-Peucker: drops vertices closer than `tolerance` px to the line. */
function simplify(points, tolerance = SIMPLIFY_PX) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const d = Math.abs((b[1] - a[1]) * x - (b[0] - a[0]) * y + b[0] * a[1] - b[1] * a[0]) / length;
    if (d > worst) [worst, index] = [d, i];
  }
  if (worst <= tolerance) return [a, b];
  return [...simplify(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplify(points.slice(index), tolerance)];
}

const same = (p, q) => p[0] === q[0] && p[1] === q[1];

/** Joins ways sharing an end vertex into longest chains (closed rings for an area). */
function join(ways) {
  const pending = ways.map((w) => [...w]);
  const result = [];
  while (pending.length) {
    const chain = pending.shift();
    let i = 0;
    while (i < pending.length && !same(chain[0], chain[chain.length - 1])) {
      const way = pending[i];
      const [head, tail] = [chain[0], chain[chain.length - 1]];
      if (same(way[0], tail)) chain.push(...way.slice(1));
      else if (same(way[way.length - 1], tail)) chain.push(...[...way].reverse().slice(1));
      else if (same(way[way.length - 1], head)) chain.unshift(...way.slice(0, -1));
      else if (same(way[0], head)) chain.unshift(...[...way].reverse().slice(0, -1));
      else {
        i++;
        continue;
      }
      pending.splice(i, 1);
      i = 0;
    }
    result.push(chain);
  }
  return result;
}

// Geometry is clipped to the image plus a small margin, so a street or the
// river crossing the edge ships only its visible part.
const MARGIN = 8;
const inside = ([x, y]) => x >= -MARGIN && x <= W + MARGIN && y >= -MARGIN && y <= H + MARGIN;

/** A line's visible runs, each keeping one vertex past the edge so it reaches it. */
function clipLine(points) {
  const runs = [[]];
  points.forEach((p, i) => {
    const keep = [points[i - 1], p, points[i + 1]].some((q) => q && inside(q));
    if (keep) runs[runs.length - 1].push(p);
    else if (runs[runs.length - 1].length) runs.push([]);
  });
  return runs.filter((run) => run.length > 1);
}

/** Sutherland-Hodgman against the margin box: a polygon's exact visible part. */
function clipPolygon(points) {
  const edges = [
    (p) => p[0] >= -MARGIN,
    (p) => p[0] <= W + MARGIN,
    (p) => p[1] >= -MARGIN,
    (p) => p[1] <= H + MARGIN,
  ];
  const bounds = [-MARGIN, W + MARGIN, -MARGIN, H + MARGIN];
  return edges.reduce((poly, isIn, e) => {
    const axis = e < 2 ? 0 : 1;
    const cross = (a, b) => {
      const t = (bounds[e] - a[axis]) / (b[axis] - a[axis]);
      return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
    };
    return poly.flatMap((p, i) => {
      const prev = poly[(i + poly.length - 1) % poly.length];
      if (isIn(p)) return isIn(prev) ? [p] : [cross(prev, p), p];
      return isIn(prev) ? [cross(prev, p)] : [];
    });
  }, points);
}

const toPath = (points, close) =>
  `M${points.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join("L")}${close ? "Z" : ""}`;

const length = (points) =>
  points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);

const groups = { g: [], w: [], s: [], r: [], p: [], m: [], t: [] };
const streets = new Map();

function addArea(cls, points) {
  const clipped = clipPolygon(points);
  if (clipped.length > 2) groups[cls].push(toPath(simplify(clipped), true));
}

function addLine(cls, points, name) {
  for (const run of clipLine(points)) {
    const line = simplify(run);
    groups[cls].push(toPath(line));
    if (name && LABELLED.has(cls)) streets.set(name, [...(streets.get(name) ?? []), run]);
  }
}

for (const element of await fetchOsm()) {
  const tags = element.tags ?? {};
  if (element.type === "relation") {
    const outer = element.members.filter((m) => m.role === "outer" && m.geometry).map((m) => project(m.geometry));
    join(outer).forEach((ring) => addArea("w", ring));
    continue;
  }
  if (!element.geometry) continue;
  const points = project(element.geometry);
  if (tags.railway) addLine("t", points);
  else if (tags.natural === "water") addArea("w", points);
  else if (tags.leisure || tags.landuse) addArea("g", points);
  else if (ROAD[tags.highway]) addLine(ROAD[tags.highway], points, tags.name);
}

// One straight label per street name, on its longest straight stretch, where
// it fits and clears the labels already placed: text bent round a corner
// breaks apart, and a long name crossing another is unreadable.
const LABEL_STRAIGHTNESS_PX = 4;
const LABEL_CLEARANCE_PX = 16;

function longestSegment(runs) {
  const segments = join(runs).flatMap((chain) => {
    const line = simplify(chain, LABEL_STRAIGHTNESS_PX);
    return line.slice(1).map((p, i) => [line[i], p]);
  });
  return segments.reduce((best, s) => (length(s) > length(best) ? s : best));
}

/** Points along a label's baseline, for the clearance test. */
function footprint([x, y], angle, width) {
  const steps = Math.ceil(width / 8);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const d = -width / 2 + (i * width) / steps;
    return [x + d * Math.cos(angle), y + d * Math.sin(angle)];
  });
}

const placed = [];
const labels = [...streets]
  .map(([name, runs]) => ({ name, segment: longestSegment(runs), width: name.length * LABEL_CHAR_PX }))
  .filter(({ segment, width }) => length(segment) > width + LABEL_CLEARANCE_PX)
  .sort((a, b) => length(b.segment) - length(a.segment))
  .flatMap(({ name, segment: [a, b], width }) => {
    let angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
    if (angle > Math.PI / 2) angle -= Math.PI;
    if (angle <= -Math.PI / 2) angle += Math.PI;
    const centre = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const points = footprint(centre, angle, width);
    const visible = points.every(([x, y]) => x > 4 && x < W - 4 && y > 12 && y < H - 4);
    const clear = points.every((p) => placed.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > LABEL_CLEARANCE_PX));
    if (!visible || !clear) return [];
    placed.push(...points);
    const deg = Math.round((angle * 180) / Math.PI);
    return [`<text transform="translate(${Math.round(centre[0])} ${Math.round(centre[1])}) rotate(${deg})" dy="5">${name}</text>`];
  });

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
  ...Object.entries(groups).map(([cls, paths]) => `<path class="${cls}" d="${paths.join("")}"/>`),
  `<g class="rues" font-size="${LABEL_FONT_PX}" text-anchor="middle">${labels.join("")}</g>`,
  "</svg>",
].join("\n");

writeFileSync(OUT, `${svg}\n`);
console.log(`${OUT}: ${W}×${H}, ${labels.length} street labels`);
