import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '36209289-3700e98ba1a72eb9f5e50a7da';
const perPage = 40;
let page = 1;
let currentQuery = '';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

form.addEventListener('submit', async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  currentQuery = e.target.searchQuery.value.trim();
  searchImages(currentQuery, page);
});

loadMoreButton.addEventListener('click', () => {
  page += 1;
  searchImages(currentQuery, page);
});

async function searchImages(query, pageNumber) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: pageNumber,
      },
    });

    const data = response.data;
    const totalHits = data.totalHits;
    const images = data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      images.forEach(image => {
        const photoCard = createPhotoCard(image);
        gallery.appendChild(photoCard);
      });

      if (page === 1) {
        loadMoreButton.classList.add('show');
      }

      if (page * perPage >= totalHits) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  }
}

function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}
