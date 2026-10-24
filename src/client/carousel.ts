// src/client/carousel.ts
// What CSS scroll-snap cannot do for PortraitCarousel.astro: arrows for a
// mouse, dots that follow the swipe, and the full-screen view a tap opens.
// The swipe itself, and the slide links, work without this file.

function currentIndex(track: HTMLElement): number {
  return Math.round(track.scrollLeft / track.clientWidth);
}

function goTo(track: HTMLElement, index: number, behavior: ScrollBehavior): void {
  track.scrollTo({ left: index * track.clientWidth, behavior });
}

/** Arrows for one track; reports the visible slide on every scroll. */
function wireTrack(frame: HTMLElement, onSlide: (index: number) => void = () => {}): HTMLElement {
  const track = frame.querySelector<HTMLElement>("[data-track]")!;
  const prev = frame.querySelector<HTMLButtonElement>("[data-prev]")!;
  const next = frame.querySelector<HTMLButtonElement>("[data-next]")!;
  const update = (): void => {
    const index = currentIndex(track);
    prev.disabled = index === 0;
    next.disabled = index === track.children.length - 1;
    onSlide(index);
  };
  prev.addEventListener("click", () => goTo(track, currentIndex(track) - 1, "smooth"));
  next.addEventListener("click", () => goTo(track, currentIndex(track) + 1, "smooth"));
  track.addEventListener("scroll", update, { passive: true });
  prev.hidden = next.hidden = false;
  update();
  return track;
}

for (const root of document.querySelectorAll<HTMLElement>("[data-carousel]")) {
  const dialog = root.querySelector<HTMLDialogElement>("[data-lightbox]")!;
  const dots = root.querySelectorAll<HTMLElement>("[data-dot]");
  const inline = wireTrack(root.querySelector<HTMLElement>("[data-frame]")!, (index) =>
    dots.forEach((dot, i) => dot.toggleAttribute("data-on", i === index)),
  );
  const full = wireTrack(dialog.querySelector<HTMLElement>("[data-frame]")!);

  inline.querySelectorAll<HTMLAnchorElement>("[data-open]").forEach((link, index) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.showModal();
      goTo(full, index, "instant");
    }),
  );
  dialog.querySelector("[data-close]")!.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(full, currentIndex(full) - 1, "smooth");
    if (event.key === "ArrowRight") goTo(full, currentIndex(full) + 1, "smooth");
  });
  // Come back to the slide the visitor stopped on, as Instagram does.
  dialog.addEventListener("close", () => goTo(inline, currentIndex(full), "instant"));
}

export {};
