const URL = 'https://pixabay.com/api/';
const API_KEY = '27639319-39c0b1a02ab6ff7f7ad16bce1';
const options = 'image_type=photo&orientation=horizontal&safesearch=true';
const perPage = 10;

export default class ApiService {
  constructor() {
    // Значення запиту
    this.meaning = '';
    // Номер сторінки
    this.page = 1;
  }

  // Отримує та повертає результат запиту
  async fetchImages() {
    try {
      const responce = await fetch(
        `${URL}?key=${API_KEY}&q=${this.meaning}&${options}&page=${this.page}&per_page=${perPage}`,
      );
      return await responce.json();
    } catch (error) {
      console.log(error.message);
    }
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
