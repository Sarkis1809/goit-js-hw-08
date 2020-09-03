import gallery from "./gallery-items.js";

const refs = {
  galleryList: document.querySelector(".gallery"),
  btnClose: document.querySelector('button[data-action="close-lightbox"]'),
  lightbox: document.querySelector(".lightbox"),
  openedImg: document.querySelector(".lightbox__image"),
  imgSources: [],
};

function createGalleryItem(image, index) {
  const galleryItem = createElementWithAttributes("li");
  galleryItem.classList.add("gallery__item");
  const galleryLink = createElementWithAttributes("a", {
    href: image.original,
  });
  galleryLink.classList.add("gallery__link");
  const galleryImage = createElementWithAttributes("img", {
    src: image.preview,
    "data-source": image.original,
    alt: image.description,
  });
  galleryImage.classList.add("gallery__image");
  refs.imgSources.push({ id: index, src: image.original });

  galleryLink.appendChild(galleryImage);
  galleryItem.appendChild(galleryLink);
  return galleryItem;
}

function createElementWithAttributes(name, attributes = {}) {
  const Element = document.createElement(name);
  for (const attribute in attributes) {
    Element.setAttribute(attribute, attributes[attribute]);
  }
  return Element;
}

function createGallery() {
  const layout = gallery.map(createGalleryItem);
  refs.galleryList.append(...layout);
}

function onGalleryClick(event) {
  event.preventDefault();
  if (event.target.nodeName !== "IMG") {
    return;
  }
  refs.lightbox.classList.add("is-open");
  changeModalSrc(event.target.dataset.source);
  window.addEventListener("keydown", onPressKey);
}

function changeModalSrc(src) {
  refs.openedImg.setAttribute("src", src);
}

function getModalSrc() {
  return refs.openedImg.getAttribute("src");
}

function closeModal() {
  refs.lightbox.classList.remove("is-open");
  changeModalSrc("");
}

function onPressKey(event) {
  if (event.code === "Escape") {
    closeModal();
  } else if (event.code === "ArrowLeft") {
    const curSrc = getModalSrc();
    let current = refs.imgSources.findIndex((el) => el.src === curSrc);
    if (current === 0) {
      current = refs.imgSources.length;
    }
    const newIndex = refs.imgSources.find((el, i) => i === current - 1);
    changeModalSrc(newIndex.src);
  } else if (event.code === "ArrowRight") {
    const curSrc = getModalSrc();
    let current = refs.imgSources.findIndex((el) => el.src === curSrc);
    if (current === refs.imgSources.length - 1) {
      current = -1;
    }
    const newIndex = refs.imgSources.find((el, i) => i === current + 1);
    changeModalSrc(newIndex.src);
  }
}

function onOverlayClick(event) {
  if (event.target !== refs.openedImg) {
    closeModal();
  }
}

createGallery();

refs.galleryList.addEventListener("click", onGalleryClick);
refs.btnClose.addEventListener("click", closeModal);
refs.lightbox.addEventListener("click", onOverlayClick);
