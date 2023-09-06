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

async function searchImages(query) {
  try {
    const data = await fetchImages(query, currentPage);
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      showErrorMessage(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(hits);

    if (initialLoad) {
      showEndOfResultsMessage(totalHits);
      initialLoad = false;
      lightbox.refresh();
    }
  } catch (error) {
    showErrorMessage(
      'An error occurred while fetching images. Please try again later.'
    );
  }
}

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const searchInput = searchForm.querySelector('input[name="searchQuery"]');
  currentQuery = searchInput.value.trim();

  if (currentQuery === '') {
    return;
  }

  currentPage = 1;
  gallery.innerHTML = '';
  initialLoad = true;
  searchImages(currentQuery);
});

// Infinite scroll
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    if (currentQuery !== '') {
      currentPage++;
      searchImages(currentQuery);
    }
  }
});

// Initial search
searchImages(currentQuery);
