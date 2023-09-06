import Notiflix from 'notiflix';

function renderImages(images) {
  const gallery = document.querySelector('.gallery');

  images.forEach(image => {
    const card = document.createElement('a');
    card.href = image.largeImageURL;
    card.classList.add('photo-card');

    card.innerHTML = `
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        `;

    gallery.appendChild(card);
  });
}

function showErrorMessage(message) {
  Notiflix.Notify.failure(message);
}

function showEndOfResultsMessage(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

export { renderImages, showErrorMessage, showEndOfResultsMessage };
