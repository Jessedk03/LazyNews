// Each entry is a function so bundlers can statically see the import path
// while we still keep a simple array-driven loader for the browser.
const SLIDE_LOADERS = [
  () => import("./data/text1.js"),
  () => import("./data/photo1.js"),
  () => import("./data/photo2.js"),
  () => import("./data/photo3.js"),
  () => import("./data/photo4.js"),
  () => import("./data/photo5.js"),
  () => import("./data/photo6.js"),
  () => import("./data/photo7.js"),
  () => import("./data/photo8.js"),
  () => import("./data/photo9.js"),
  () => import("./data/photo10.js"),
  () => import("./data/photo11.js"),
  () => import("./data/photo12.js"),
  () => import("./data/photo13.js"),
  () => import("./data/photo14.js"),
  () => import("./data/photo15.js"),
  () => import("./data/photo16.js"),
  () => import("./data/text2.js"),
];

const AUTOPLAY_INTERVAL_MS = 9000;

let track;
let dotsContainer;
let progressFill;
let slideCounterEl;

let prevButton;
let nextButton;
let musicToggle;
let bgMusic;
let carouselViewport;

let slides = [];
let currentIndex = 0;
let autoplayId = null;
let isHovering = false;
let hasSetupControls = false;

async function loadSlidesFromModules() {
  const results = await Promise.all(
    SLIDE_LOADERS.map(async (load, index) => {
      try {
        const mod = await load();
        const slide = mod.default ?? null;
        if (!slide || typeof slide !== "object") {
          console.warn("Love Wrapped: Slide module missing default export", {
            index,
          });
          return null;
        }

        if (slide.type === "photo") {
          if (!slide.url) {
            console.warn("Love Wrapped: Photo slide missing url", { index });
            return null;
          }
        } else if (slide.type === "text") {
          // Text slides are flexible; no required fields beyond type.
        } else {
          console.warn("Love Wrapped: Unknown slide type", {
            index,
            type: slide.type,
          });
          return null;
        }

        return slide;
      } catch (error) {
        console.error("Failed to load slide module", { index, error });
        return null;
      }
    }),
  );

  return results.filter(Boolean);
}

function createPhotoSlide(slide, index, total) {
  const outer = document.createElement("article");
  outer.className = "slide slide-photo";
  outer.setAttribute("role", "group");
  outer.setAttribute("aria-roledescription", "slide");
  outer.setAttribute("aria-label", `Photo ${index + 1} of ${total}`);

  const inner = document.createElement("div");
  inner.className = "slide-inner";

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = slide.url;
  img.loading = "lazy";
  img.alt = slide.description || "A moment from our story";

  const caption = document.createElement("figcaption");

  const badge = document.createElement("span");
  badge.className = "slide-photo-badge";
  badge.textContent = "Love Wrapped";

  const captionText = document.createElement("span");
  captionText.textContent = slide.description || "";

  caption.appendChild(badge);
  caption.appendChild(captionText);

  figure.appendChild(img);
  figure.appendChild(caption);

  const content = document.createElement("div");
  content.className = "slide-content";

  const kicker = document.createElement("div");
  kicker.className = "slide-kicker";
  kicker.textContent = "Captured moments";

  const title = document.createElement("h2");
  title.className = "slide-title";
  title.textContent = "A frame from our universe";

  const description = document.createElement("p");
  description.className = "slide-description";
  description.textContent =
    slide.description || "This moment lives on in our Love Wrapped.";

  const metaRow = document.createElement("div");
  metaRow.className = "slide-meta-row";

  const meta1 = document.createElement("div");
  meta1.className = "stat-pill";
  meta1.textContent = "Cosmic memory";

  const meta2 = document.createElement("div");
  meta2.className = "stat-pill";
  meta2.textContent = "Infinite replays";

  metaRow.appendChild(meta1);
  metaRow.appendChild(meta2);

  content.appendChild(kicker);
  content.appendChild(title);
  if (slide.description) {
    content.appendChild(description);
  }
  content.appendChild(metaRow);

  inner.appendChild(figure);
  inner.appendChild(content);

  outer.appendChild(inner);
  return outer;
}

function createTextSlide(slide, index, total) {
  const outer = document.createElement("article");
  outer.className = "slide slide-text slide-text-only";
  outer.setAttribute("role", "group");
  outer.setAttribute("aria-roledescription", "slide");
  outer.setAttribute("aria-label", `Story slide ${index + 1} of ${total}`);

  const inner = document.createElement("div");
  inner.className = "slide-inner";

  const content = document.createElement("div");
  content.className = "slide-content";

  const kicker = document.createElement("div");
  kicker.className = "slide-kicker";
  kicker.textContent = "Our love wrapped";

  const title = document.createElement("h2");
  title.className = "slide-title";
  title.textContent = slide.title ?? "Our Love Wrapped";

  const description = document.createElement("p");
  description.className = "slide-description";
  description.textContent =
    slide.description ?? "This chapter is still being written.";

  const footer = document.createElement("p");
  footer.className = "slide-footer";
  if (slide.footer) {
    footer.textContent = slide.footer;
  } else {
    footer.textContent = "Love you to the moon, the stars, and back again.";
  }

  const metaRow = document.createElement("div");
  metaRow.className = "slide-meta-row";

  const stat1 = document.createElement("div");
  stat1.className = "stat-pill";
  stat1.textContent = "Laughs shared: 1,000+";

  const stat2 = document.createElement("div");
  stat2.className = "stat-pill";
  stat2.textContent = "Miles traveled: countless";

  const stat3 = document.createElement("div");
  stat3.className = "stat-pill";
  stat3.textContent = "Most played song: our story";

  metaRow.appendChild(stat1);
  metaRow.appendChild(stat2);
  metaRow.appendChild(stat3);

  content.appendChild(kicker);
  content.appendChild(title);
  content.appendChild(description);
  content.appendChild(footer);
  content.appendChild(metaRow);

  inner.appendChild(content);
  outer.appendChild(inner);

  return outer;
}

function applyThemeForSlide(index) {
  const themeIndex = index % 3;
  switch (themeIndex) {
    case 0:
      document.documentElement.style.setProperty("--accent-1", "#ff6fb5");
      document.documentElement.style.setProperty("--accent-2", "#ffc46b");
      break;
    case 1:
      document.documentElement.style.setProperty("--accent-1", "#8f94fb");
      document.documentElement.style.setProperty("--accent-2", "#ff6fb5");
      break;
    case 2:
      document.documentElement.style.setProperty("--accent-1", "#7cf6ff");
      document.documentElement.style.setProperty("--accent-2", "#8f94fb");
      break;
    default:
      break;
  }
}

function updateTrackPosition(index) {
  const offset = -index * 100;
  track.style.transform = `translateX(${offset}%)`;

  const slideNodes = track.querySelectorAll(".slide");
  slideNodes.forEach((node, i) => {
    if (i === index) {
      node.classList.add("is-active");
    } else {
      node.classList.remove("is-active");
    }
  });
}

function updateDots(index) {
  const dotNodes = dotsContainer.querySelectorAll(".carousel-dot");
  dotNodes.forEach((dot, i) => {
    const isActive = i === index;
    dot.setAttribute("aria-selected", String(isActive));
    dot.tabIndex = isActive ? 0 : -1;
  });
}

function updateCounter(index, total) {
  slideCounterEl.textContent = `${index + 1} / ${total}`;
}

function resetProgress(durationMs) {
  if (!progressFill) return;
  progressFill.style.transition = "none";
  progressFill.style.width = "0%";

  // Force reflow so the browser resets the transition
  void progressFill.offsetWidth;

  progressFill.style.transition = `width ${durationMs}ms linear`;
  progressFill.style.width = "100%";
}

function goToSlide(nextIndex) {
  if (!slides.length) return;
  const total = slides.length;
  const wrappedIndex = (nextIndex + total) % total;
  currentIndex = wrappedIndex;

  applyThemeForSlide(currentIndex);
  updateTrackPosition(currentIndex);
  updateDots(currentIndex);
  updateCounter(currentIndex, total);
  resetProgress(AUTOPLAY_INTERVAL_MS);
}

function goToNext() {
  goToSlide(currentIndex + 1);
}

function goToPrev() {
  goToSlide(currentIndex - 1);
}

function startAutoplay() {
  stopAutoplay();
  autoplayId = window.setInterval(() => {
    if (!isHovering) {
      goToNext();
    }
  }, AUTOPLAY_INTERVAL_MS);
  resetProgress(AUTOPLAY_INTERVAL_MS);
}

function stopAutoplay() {
  if (autoplayId !== null) {
    window.clearInterval(autoplayId);
    autoplayId = null;
  }
}

function setupHoverPause() {
  if (!carouselViewport) return;
  carouselViewport.addEventListener("mouseenter", () => {
    isHovering = true;
  });
  carouselViewport.addEventListener("mouseleave", () => {
    isHovering = false;
  });
}

function setupDots(total) {
  dotsContainer.innerHTML = "";

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);

    dot.addEventListener("click", () => {
      goToSlide(i);
    });

    dotsContainer.appendChild(dot);
  }
}

function setupKeyboard() {
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrev();
    }
  });
}

function setupNavButtons() {
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      goToPrev();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goToNext();
    });
  }
}

function setupMusicToggle() {
  if (!musicToggle || !bgMusic) return;

  musicToggle.addEventListener("click", async () => {
    const isActive = musicToggle.getAttribute("aria-pressed") === "true";
    const nextState = !isActive;
    musicToggle.setAttribute("aria-pressed", String(nextState));

    try {
      if (nextState) {
        await bgMusic.play();
      } else {
        bgMusic.pause();
      }
    } catch (error) {
      console.error("Unable to toggle music", error);
    }
  });
}

async function init() {
  slides = await loadSlidesFromModules();

  if (!slides.length) {
    track.textContent = "No slides yet. Add some modules in the data folder.";
    return;
  }

  const total = slides.length;
  track.innerHTML = "";

  slides.forEach((slide, index) => {
    if (slide.type === "photo") {
      track.appendChild(createPhotoSlide(slide, index, total));
    } else if (slide.type === "text") {
      track.appendChild(createTextSlide(slide, index, total));
    }
  });

  // Dots depend on slide count, so always rebuild them.
  setupDots(total);

  // Global / long-lived event handlers should only be attached once.
  if (!hasSetupControls) {
    setupNavButtons();
    setupKeyboard();
    setupHoverPause();
    setupMusicToggle();
    hasSetupControls = true;
  }

  goToSlide(0);
  startAutoplay();
}

export default function startLoveWrapped() {
  // If this is called multiple times (e.g. React StrictMode dev double-mount),
  // make sure we don't leak old timers.
  stopAutoplay();
  isHovering = false;

  track = document.getElementById("carousel-track");
  dotsContainer = document.getElementById("carousel-dots");
  progressFill = document.getElementById("progress-fill");
  slideCounterEl = document.getElementById("slide-counter");

  prevButton = document.querySelector(".nav-prev");
  nextButton = document.querySelector(".nav-next");
  musicToggle = document.querySelector(".music-toggle");
  bgMusic = document.getElementById("bg-music");
  carouselViewport = document.querySelector(".carousel-viewport");

  if (!track || !dotsContainer || !progressFill || !slideCounterEl) {
    console.error("Love Wrapped: Required carousel elements not found in DOM.");
    return;
  }

  init().catch((error) => {
    console.error("Failed to initialize Love Wrapped app", error);
  });
}
