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

/** Builds the gallery and connects the controls. */
function init() {
  renderGallery();
  CLOSE_BUTTON.addEventListener("click", closeOverlay);
  NEXT_BUTTON.addEventListener("click", showNextImage);
  PREVIOUS_BUTTON.addEventListener("click", showPreviousImage);
  OVERLAY.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleKeydown);
}

init();

/**
 * Creates a gallery button from the HTML template.
 * @param {number} index - position of image
 * @returns {HTMLButtonElement} Finished gallery button
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

/** Additionally, it sets up the click event listener for each button to open the overlay with the corresponding image. */
function renderGallery() {
  for (let index = 0; index < IMAGES.length; index++) {
    GALLERY.appendChild(createGalleryButton(index));
  }
}

/**
 * Updates the image, title, and image counter in the overlay.
 * @param {number} index - position of image
 */
async function showImage(index) {
  currentImageIndex = index;
  OVERLAY_IMAGE.style.visibility = "hidden";
  OVERLAY_IMAGE.src = IMAGE_DIRECTORY + IMAGES[index];
  OVERLAY_IMAGE.alt = IMAGE_TITLES[index];
  OVERLAY_TITLE.textContent = IMAGE_TITLES[index];
  IMAGE_COUNTER.textContent = `${index + 1}/${IMAGES.length}`;

  try {
    await OVERLAY_IMAGE.decode();
  } catch { return; }
  if (index === currentImageIndex) {
    OVERLAY_IMAGE.style.visibility = "visible";
  }
}

/**
 * Opens the overlay and sets the focus to the close button.
 * @param {number} index - position of image
 * @param {HTMLButtonElement} triggerButton - Triggering gallery button
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

/** Closes the overlay and returns the focus to the gallery button. */
function closeOverlay() {
  OVERLAY.style.display = "none";
  MAIN.inert = false;
  HEADER.inert = false;
  FOOTER.inert = false;
  previousFocus?.focus();
  previousFocus = null;
}

/** Buttons forward and backward */
function getWrappedIndex(index, direction, itemCount) {
  return (index + direction + itemCount) % itemCount;
}

function showNextImage() {
  showImage(getWrappedIndex(currentImageIndex, 1, IMAGES.length));
}

function showPreviousImage() {
  showImage(getWrappedIndex(currentImageIndex, -1, IMAGES.length));
}

/**
 * Closes the overlay when clicking on the dark background.
 * @param {MouseEvent} event - The click event.
 */
function handleOverlayClick(event) {
  if (event.target === OVERLAY) {
    closeOverlay();
  }
}

/**
 * Moves the focus with Tab or Shift+Tab between the overlay buttons.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleTabKey(event) {
  const FOCUSED_INDEX = OVERLAY_BUTTONS.indexOf(document.activeElement);
  const DIRECTION = event.shiftKey ? -1 : 1;
  const BUTTON_COUNT = OVERLAY_BUTTONS.length;
  const NEXT_INDEX = getWrappedIndex(FOCUSED_INDEX, DIRECTION, BUTTON_COUNT);

  event.preventDefault();
  OVERLAY_BUTTONS[NEXT_INDEX].focus();
}

/**
 * Processes Escape, arrow keys, and Tab when the overlay is open.
 * @param {KeyboardEvent} event - The keyboard event.
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

