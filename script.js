const image_directory = "./assets/img/";

const images = [
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

const image_titles = [
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

const gallery = document.querySelector(".gallery");
const gallery_button_template = document.getElementById("gallery-button-template");
const overlay = document.querySelector(".overlay");
const overlay_image = document.getElementById("overlay-image");
const overlay_title = document.getElementById("overlay-title");
const image_counter = document.getElementById("image-counter");
const close_button = document.getElementById("close-overlay");
const next_button = document.getElementById("next-image");
const previous_button = document.getElementById("previous-image");
const overlay_buttons = [close_button, previous_button, next_button];
const main = document.querySelector("main");
const header = document.querySelector("header");
const footer = document.querySelector("footer");

let current_image_index = 0;
let previous_focus = null;

/** Builds the gallery and connects the controls. */
function init() {
  render_gallery();
  close_button.addEventListener("click", close_overlay);
  next_button.addEventListener("click", show_next_image);
  previous_button.addEventListener("click", show_previous_image);
  overlay.addEventListener("click", handle_overlay_click);
  document.addEventListener("keydown", handle_keydown);
}

init();

/**
 * Creates a gallery button from the HTML template.
 * @param {number} index - position of image
 * @returns {HTMLButtonElement} Finished gallery button
 */
function create_gallery_button(index) {
  const button = gallery_button_template.content.firstElementChild.cloneNode(true);
  const image = button.querySelector("img");

  image.src = image_directory + images[index];
  image.loading = "lazy";
  button.setAttribute("aria-label", `Open image: ${image_titles[index]}`);
  button.addEventListener("click", () => open_overlay(index, button));

  return button;
}

/** Additionally, it sets up the click event listener for each button to open the overlay with the corresponding image. */
function render_gallery() {
  for (let index = 0; index < images.length; index++) {
    gallery.appendChild(create_gallery_button(index));
  }
}

/**
 * Updates the image, title, and image counter in the overlay.
 * @param {number} index - position of image
 */
async function show_image(index) {
  current_image_index = index;
  overlay_image.style.visibility = "hidden";
  overlay_image.src = image_directory + images[index];
  overlay_image.alt = image_titles[index];
  overlay_title.textContent = image_titles[index];
  image_counter.textContent = `${index + 1}/${images.length}`;

  try {
    await overlay_image.decode();
  } catch { return; }
  if (index === current_image_index) {
    overlay_image.style.visibility = "visible";
  }
}

/**
 * Opens the overlay and sets the focus to the close button.
 * @param {number} index - position of image
 * @param {HTMLButtonElement} trigger_button - Triggering gallery button
 */
function open_overlay(index, trigger_button) {
  previous_focus = trigger_button;
  show_image(index);
  overlay.style.display = "flex";
  document.body.classList.add("overlay-open");
  main.inert = true;
  header.inert = true;
  footer.inert = true;
  close_button.focus();
}

/** Closes the overlay and returns the focus to the gallery button. */
function close_overlay() {
  overlay.style.display = "none";
  document.body.classList.remove("overlay-open");
  main.inert = false;
  header.inert = false;
  footer.inert = false;
  previous_focus?.focus();
  previous_focus = null;
}

/** Buttons forward and backward */
function get_wrapped_index(index, direction, item_count) {
  return (index + direction + item_count) % item_count;
}

function show_next_image() {
  show_image(get_wrapped_index(current_image_index, 1, images.length));
}

function show_previous_image() {
  show_image(get_wrapped_index(current_image_index, -1, images.length));
}

/**
 * Closes the overlay when clicking on the dark background.
 * @param {MouseEvent} event - The click event.
 */
function handle_overlay_click(event) {
  if (event.target === overlay) {
    close_overlay();
  }
}

/**
 * Moves the focus with Tab or Shift+Tab between the overlay buttons.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handle_tab_key(event) {
  const focused_index = overlay_buttons.indexOf(document.activeElement);
  const direction = event.shiftKey ? -1 : 1;
  const button_count = overlay_buttons.length;
  const next_index = get_wrapped_index(focused_index, direction, button_count);

  event.preventDefault();
  overlay_buttons[next_index].focus();
}

/**
 * Processes Escape, arrow keys, and Tab when the overlay is open.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handle_keydown(event) {
  if (overlay.style.display !== "flex") {
    return;
  }
  if (event.key === "Escape") {
    close_overlay();
  } else if (event.key === "ArrowRight") {
    show_next_image();
  } else if (event.key === "ArrowLeft") {
    show_previous_image();
  } else if (event.key === "Tab") {
    handle_tab_key(event);
  }
}

