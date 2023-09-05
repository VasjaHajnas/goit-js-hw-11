import axios from 'axios';
import Notiflix from 'notiflix';
import InfiniteScroll from 'infinite-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '36209289-3700e98ba1a72eb9f5e50a7da';
const perPage = 40;
let page = 1;
let currentQuery = '';
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const form = document.getElementById('search-form');
const lightbox = new SimpleLightbox('.gallery a');

const infScroll = new InfiniteScroll(gallery, {
  path: generateApiUrl,
  responseType: 'text',
  history: false,
});

form.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

infScroll.on('load', loadMoreImages);

async function handleFormSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  currentQuery = e.target.searchQuery.value.trim();
  await searchImages(currentQuery, page);
}

async function loadMoreImages() {
  page += 1;
  await searchImages(currentQuery, page);
}

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

    const { totalHits, hits: images } = response.data;

    if (totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      const imageElements = images.map(image => {
        const photoCard = createPhotoCard(image);
        const imageLink = document.createElement('a');
        imageLink.href = image.largeImageURL;
        imageLink.appendChild(photoCard);
        return imageLink;
      });

      gallery.append(...imageElements);

      if (page === 1) {
        loadMoreButton.classList.add('show');
      }

      if (page * perPage >= totalHits) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    lightbox.refresh();
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  }
}

function createPhotoCard(image) {
  const { webformatURL, tags, likes, views, comments, downloads } = image;

  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = webformatURL;
  img.alt = tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = [
    { label: 'Likes', value: likes },
    { label: 'Views', value: views },
    { label: 'Comments', value: comments },
    { label: 'Downloads', value: downloads },
  ];

  infoItems.forEach(item => {
    const itemElement = document.createElement('p');
    itemElement.classList.add('info-item');
    itemElement.innerHTML = `<b>${item.label}:</b> ${item.value}`;
    info.appendChild(itemElement);
  });

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function generateApiUrl() {
  return `https://pixabay.com/api/?key=${API_KEY}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;
}
