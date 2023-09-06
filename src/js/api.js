import axios from 'axios';

const apiKey = '36209289-3700e98ba1a72eb9f5e50a7da';

async function fetchImages(query, page = 1) {
  try {
    if (!query) {
      throw new Error('Query is required.');
    }

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export { fetchImages };
