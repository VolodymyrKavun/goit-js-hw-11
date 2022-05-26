import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';
const API_KEY = '27639319-39c0b1a02ab6ff7f7ad16bce1';
const options = 'image_type=photo&orientation=horizontal&safesearch=true';
const perPage = 40;

export default class ApiService {
  constructor() {
    // Зачення запиту
    this.meaning = '';
    // Номер сторінки
    this.page = 1;
  }

  // Отримує та повертає результат запиту
  fetchImages() {
    return fetch(
      `${URL}?key=${API_KEY}&q=${this.meaning}&${options}&page=${this.page}&per_page=${perPage}`,
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
        } else if (data.totalHits === 0) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
        console.log(data);
        this.incrementPage();
        return data.hits;
      })
      .catch(error => {
        console.log(error),
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
      });
  }

  // Добавляє сторінку
  incrementPage() {
    this.page += 1;
  }

  // Скидує сторінку до початкового стану
  resetPage() {
    this.page = 1;
  }

  // Контролює термін запиту
  get query() {
    return this.meaning;
  }

  set query(newMeaning) {
    this.meaning = newMeaning;
  }
}
