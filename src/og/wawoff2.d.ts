// src/og/wawoff2.d.ts
// wawoff2 ships no types (verified: no .d.ts under node_modules/wawoff2). This is
// the one shim the project needs, kept next to its one caller rather than in a
// shared ambient-types file nothing else would use.
declare module "wawoff2" {
  export function decompress(woff2: Uint8Array): Promise<Uint8Array>;
  export function compress(ttf: Uint8Array): Promise<Uint8Array>;
}
