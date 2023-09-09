import { fetchImages } from './js/api.js';
import {
  renderImages,
  showErrorMessage,
  showEndOfResultsMessage,
} from './js/ui.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
let currentQuery = '';
let initialLoad = true;
let noResultsShown = false;
let loading = false;
let totalHits = 0;
let displayedHits = 0;

// Функція для пошуку та відображення зображень
async function searchAndDisplayImages(query) {
  try {
    const data = await fetchImages(query, currentPage);
    const { hits, totalHits: newTotalHits } = data;

    if (hits.length === 0) {
      if (!noResultsShown) {
        showErrorMessage(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        noResultsShown = true;
      }
      return;
    }

    renderImages(hits);
    displayedHits += hits.length;

    if (initialLoad) {
      totalHits = newTotalHits;
      showEndOfResultsMessage(totalHits);
      initialLoad = false;
    }

    lightbox.refresh();
  } catch (error) {
    showErrorMessage(
      'An error occurred while fetching images. Please try again later.'
    );
  } finally {
    loading = false;
  }
}

// Функція для обробки події подачі форми пошуку
async function handleSearchFormSubmit(e) {
  e.preventDefault();
  const searchInput = searchForm.querySelector('input[name="searchQuery"]');
  currentQuery = searchInput.value.trim();

  if (currentQuery === '') {
    showErrorMessage('You have not entered a request');
    return;
  }

  currentPage = 1;
  gallery.innerHTML = '';
  initialLoad = true;
  noResultsShown = false;
  totalHits = 0;
  displayedHits = 0;
  await searchAndDisplayImages(currentQuery);
}

// Функція для завантаження зображень при прокрутці
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollTrigger = 100;

  if (
    !loading &&
    !noResultsShown &&
    displayedHits < totalHits &&
    scrollTop + clientHeight >= scrollHeight - scrollTrigger
  ) {
    if (currentQuery !== '') {
      currentPage++;
      loading = true;
      searchAndDisplayImages(currentQuery);
    }
  }
}

// Додавання обробників подій
searchForm.addEventListener('submit', handleSearchFormSubmit);
window.addEventListener('scroll', handleScroll);
