const IMAGE_DIRECTORY = "./assets/img/";

const IMAGES = [
  "alaska-full.jpg",
  "city-full.jpg",
  "sky-full.png",
  "blue-tit-full.jpg",
  "hurricane-full.jpg",
  "lake-full.jpg",
  "moorente-full.jpg",
  "sea-full.jpg",
  "snow-bunting-full.jpg",
  "snow-leopard-full.jpg",
  "mountain-full.jpg",
  "winter-full.jpg"
];

const IMAGE_TITLES = [
  "Alaska",
  "Stadt bei Nacht",
  "Himmel",
  "Blaumeise",
  "Hurricane",
  "See",
  "Moorente",
  "Meer",
  "Schneeammer",
  "Schneeleopard",
  "Gebirge",
  "Winter"
];

const GALLERY = document.querySelector(".gallery");
const GALLERY_BUTTON_TEMPLATE = document.getElementById("gallery-button-template");
const OVERLAY = document.querySelector(".overlay");
const OVERLAY_IMAGE = document.getElementById("overlay-image");
const OVERLAY_TITLE = document.getElementById("overlay-title");
const IMAGE_COUNTER = document.getElementById("image-counter");
const CLOSE_BUTTON = document.getElementById("close-overlay");
const NEXT_BUTTON = document.getElementById("next-image");
const PREVIOUS_BUTTON = document.getElementById("previous-image");
const OVERLAY_BUTTONS = [CLOSE_BUTTON, PREVIOUS_BUTTON, NEXT_BUTTON];
const MAIN = document.querySelector("main");
const HEADER = document.querySelector("header");
const FOOTER = document.querySelector("footer");

let currentImageIndex = 0;
let previousFocus = null;

/**
 * Erstellt einen Galeriebutton aus der HTML-Vorlage.
 * @param {number} index - Position des Bildes.
 * @returns {HTMLButtonElement} Der fertige Galeriebutton.
 */
function createGalleryButton(index) {
  const BUTTON = GALLERY_BUTTON_TEMPLATE.content.firstElementChild.cloneNode(true);
  const IMAGE = BUTTON.querySelector("img");

  IMAGE.src = IMAGE_DIRECTORY + IMAGES[index];
  IMAGE.loading = "lazy";
  BUTTON.setAttribute("aria-label", `Open image: ${IMAGE_TITLES[index]}`);
  BUTTON.addEventListener("click", () => openOverlay(index, BUTTON));

  return BUTTON;
}

/** Fügt für jedes Foto einen Button in die Galerie ein. */
function renderGallery() {
  for (let index = 0; index < IMAGES.length; index++) {
    GALLERY.appendChild(createGalleryButton(index));
  }
}

/**
 * Aktualisiert Bild, Titel und Bildzähler im Overlay.
 * @param {number} index - Position des Bildes.
 */
function showImage(index) {
  currentImageIndex = index;
  OVERLAY_IMAGE.src = IMAGE_DIRECTORY + IMAGES[index];
  OVERLAY_IMAGE.alt = IMAGE_TITLES[index];
  OVERLAY_TITLE.textContent = IMAGE_TITLES[index];
  IMAGE_COUNTER.textContent = `${index + 1}/${IMAGES.length}`;
}

/**
 * Öffnet das Overlay und setzt den Fokus auf den Schließen-Button.
 * @param {number} index - Position des Bildes.
 * @param {HTMLButtonElement} triggerButton - Auslösender Galeriebutton.
 */
function openOverlay(index, triggerButton) {
  previousFocus = triggerButton;
  showImage(index);
  OVERLAY.style.display = "flex";
  MAIN.inert = true;
  HEADER.inert = true;
  FOOTER.inert = true;
  CLOSE_BUTTON.focus();
}

/** Schließt das Overlay und gibt den Fokus an den Galeriebutton zurück. */
function closeOverlay() {
  OVERLAY.style.display = "none";
  MAIN.inert = false;
  HEADER.inert = false;
  FOOTER.inert = false;
  previousFocus?.focus();
  previousFocus = null;
}

/** Zeigt das nächste Bild an und springt am Ende zum ersten Bild. */
function showNextImage() {
  const NEXT_INDEX = (currentImageIndex + 1) % IMAGES.length;
  showImage(NEXT_INDEX);
}

/** Zeigt das vorherige Bild an und springt am Anfang zum letzten Bild. */
function showPreviousImage() {
  const PREVIOUS_INDEX =
    (currentImageIndex - 1 + IMAGES.length) % IMAGES.length;
  showImage(PREVIOUS_INDEX);
}

/**
 * Schließt das Overlay bei einem Klick auf den dunklen Hintergrund.
 * @param {MouseEvent} event - Das Klickereignis.
 */
function handleOverlayClick(event) {
  if (event.target === OVERLAY) {
    closeOverlay();
  }
}

/**
 * Bewegt den Fokus mit Tab oder Umschalt+Tab zwischen den Overlay-Buttons.
 * @param {KeyboardEvent} event - Das Tastaturereignis.
 */
function handleTabKey(event) {
  const FOCUSED_INDEX = OVERLAY_BUTTONS.indexOf(document.activeElement);
  const DIRECTION = event.shiftKey ? -1 : 1;
  const BUTTON_COUNT = OVERLAY_BUTTONS.length;
  const NEXT_INDEX = (FOCUSED_INDEX + DIRECTION + BUTTON_COUNT) % BUTTON_COUNT;

  event.preventDefault();
  OVERLAY_BUTTONS[NEXT_INDEX].focus();
}

/**
 * Verarbeitet Escape, die Pfeiltasten und Tab bei geöffnetem Overlay.
 * @param {KeyboardEvent} event - Das Tastaturereignis.
 */
function handleKeydown(event) {
  if (OVERLAY.style.display !== "flex") {
    return;
  }
  if (event.key === "Escape") {
    closeOverlay();
  } else if (event.key === "ArrowRight") {
    showNextImage();
  } else if (event.key === "ArrowLeft") {
    showPreviousImage();
  } else if (event.key === "Tab") {
    handleTabKey(event);
  }
}

/** Baut die Galerie auf und verbindet die Bedienelemente. */
function init() {
  renderGallery();
  CLOSE_BUTTON.addEventListener("click", closeOverlay);
  NEXT_BUTTON.addEventListener("click", showNextImage);
  PREVIOUS_BUTTON.addEventListener("click", showPreviousImage);
  OVERLAY.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleKeydown);
}

init();