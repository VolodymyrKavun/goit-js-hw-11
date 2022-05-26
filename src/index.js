import './css/styles.css';
import getRefs from './js/refs';
import debounce from 'lodash.debounce';
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

function onFormSubmit(e) {
  e.preventDefault();
  clearGalleryContainer();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (apiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  apiService.resetPage();
  apiService.fetchImages().then(renderMarkupImages);
}

function onLoadMore() {
  if (apiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  apiService.fetchImages().then(renderMarkupImages);
}

function renderMarkupImages(cards) {
  refs.galleryEl.insertAdjacentHTML('beforeend', cardImagesTpl(cards));
}

function clearGalleryContainer() {
  refs.galleryEl.innerHTML = '';
}
