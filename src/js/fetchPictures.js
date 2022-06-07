import axios from 'axios';

export default async function fetchPictures(name, pageNumber) {
    const axios = require('axios');

    const API_KEY = '27726986-1b2491f220453818d3229fc31';

    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`;

    const pictures = await axios.get(URL);

    return pictures;
}