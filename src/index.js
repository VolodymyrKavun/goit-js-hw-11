import './css/styles.css';
import getRefs from './js/refs';
import Notiflix from 'notiflix';
import cardImagesTpl from './templates/card-images.hbs';
import ApiService from './js/api';

// Отримання доступу до елементів
const refs = getRefs();

// Екземпляр класу
const apiService = new ApiService();

// Вішання слухачів
refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonMore.addEventListener('click', onLoadMore);

// Первинне значення кнопки "load-more"
refs.buttonMore.classList.add('is-hidden');

async function onFormSubmit(e) {
  e.preventDefault();
  clearGalleryContainer();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  apiService.resetPage();

  try {
    checkSearchBtnAndRender();
  } catch (error) {
    console.log(error), banMessage();
  }
}

async function onLoadMore() {
  try {
    const data = await apiService.fetchImages();
    checkLoadInput();

    apiService.incrementPage();
    renderMarkupImages(data.hits);
  } catch (error) {
    console.log(error), banMessage();
  }
}

// Ф-я рендеру розмітки
function renderMarkupImages(cards) {
  refs.galleryEl.insertAdjacentHTML('beforeend', cardImagesTpl(cards));
}

// Ф-я очищення галереї
function clearGalleryContainer() {
  refs.galleryEl.innerHTML = '';
}

// Ф-я показу негативного повідомлення
function banMessage() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

async function checkSearchBtnAndRender() {
  const data = await apiService.fetchImages();
  if (apiService.query === '' || data.totalHits === 0) {
    refs.buttonMore.classList.add('is-hidden');
    return banMessage();
  } else if (data.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    refs.buttonMore.classList.remove('is-hidden');
  }
  apiService.incrementPage();
  renderMarkupImages(data.hits);
}

async function checkLoadInput() {
  const data = await apiService.fetchImages();
  console.log(data);
  if (apiService.query === '' || data.totalHits === 0) {
    return banMessage();
  } else if (data.hits.length === 0) {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    refs.buttonMore.classList.add('is-hidden');
  }
}
