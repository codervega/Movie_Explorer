const axios = require('axios');
require('dotenv').config();

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY }
});

module.exports = tmdb;
