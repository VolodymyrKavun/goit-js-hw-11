export default function getRefs() {
  return {
    formEl: document.querySelector('#search-form'),
    inputEl: document.querySelector('[type="text"]'),
    buttonEl: document.querySelector('[type="submit"]'),
    buttonMore: document.querySelector('.load-more'),
    galleryEl: document.querySelector('.gallery'),
    loadingEl: document.querySelector('.loading'),
  };
}
