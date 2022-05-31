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

function onFormSubmit(e) {
  e.preventDefault();
  clearGalleryContainer();

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();

  apiService.resetPage();

  apiService
    .fetchImages()
    .then(data => {
      if (apiService.query === '' || data.totalHits === 0) {
        return banMessage();
      } else if (data.totalHits > 0) {
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
        refs.buttonMore.classList.remove('is-hidden');
      }

      apiService.incrementPage();
      return data.hits;
    })
    .then(renderMarkupImages)
    .catch(error => {
      console.log(error), banMessage();
    });
}

function onLoadMore() {
  apiService
    .fetchImages()
    .then(data => {
      if (apiService.query === '' || data.totalHits === 0) {
        return banMessage();
      } else if (data.hits.length === 0) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        refs.buttonMore.classList.add('is-hidden');
      }

      apiService.incrementPage();
      return data.hits;
    })
    .then(renderMarkupImages)
    .catch(error => {
      console.log(error), banMessage();
    });
}

function renderMarkupImages(cards) {
  refs.galleryEl.insertAdjacentHTML('beforeend', cardImagesTpl(cards));
}

function clearGalleryContainer() {
  refs.galleryEl.innerHTML = '';
}

function banMessage() {
  return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}
