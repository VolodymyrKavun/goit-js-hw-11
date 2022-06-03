import './css/styles.css';
import getRefs from './js/refs';
import Notiflix from 'notiflix';
import cardImagesTpl from './templates/card-images.hbs';
import ApiService from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Отримання доступу до елементів
const refs = getRefs();

// Екземпляр класу
const apiService = new ApiService();

// Вішання слухачів
refs.formEl.addEventListener('submit', onFormSubmit);
refs.buttonMore.addEventListener('click', onLoadMore);

// Первинне значення кнопки "load-more"
refs.buttonMore.classList.add('is-hidden');

// SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 500 });

async function onFormSubmit(e) {
  e.preventDefault();
  clearGalleryContainer();
  // document.documentElement.scrollTop = 0;

  apiService.query = e.currentTarget.elements.searchQuery.value.trim();
  if (apiService.query === '') {
    return banMessage();
  }
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
    if (data.hits.length === 0) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      // refs.loadingEl.classList.remove('show');
      refs.buttonMore.classList.add('is-hidden');
    }

    apiService.incrementPage();
    renderMarkupImages(data.hits);
    lightbox.refresh();
    scrollLazy();
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

// Ф-я перевірки та рендеру
async function checkSearchBtnAndRender() {
  const data = await apiService.fetchImages();
  if (data.totalHits === 0) {
    refs.buttonMore.classList.add('is-hidden');
    return banMessage();
  } else if (data.totalHits > 0) {
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    refs.buttonMore.classList.remove('is-hidden');
  }
  apiService.incrementPage();
  renderMarkupImages(data.hits);
  lightbox.refresh();
}

// Ф-я плавного прокручування сторінки
function scrollLazy() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Infinite Scrolling
// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   // console.log({ scrollTop, scrollHeight, clientHeight });
//   if (clientHeight + Math.round(scrollTop) >= scrollHeight) {
//     // show the loading animation
//     showLoading();
//   }
// });

// function showLoading() {
//   refs.loadingEl.classList.add('show');
//   // load more data
//   setTimeout(onLoadMore, 1000);
// }
