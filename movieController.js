const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Cast = require("../models/Cast");
const tmdb = require("../utils/tmdbFetcher");

const fetchAndStoreMovies = async (req, res) => {
  try {
    let page = 1;
    let allMovies = [];

    while (allMovies.length < 500) {
      const { data } = await tmdb.get("/discover/movie", { params: { page } });
      allMovies.push(...data.results);
      page++;
    }

    for (let movie of allMovies.slice(0, 500)) {
      const [details, credits] = await Promise.all([
        tmdb.get(`/movie/${movie.id}`),
        tmdb.get(`/movie/${movie.id}/credits`)
      ]);

      const genreIds = details.data.genres.map(g => g.id);
      for (let genre of details.data.genres) {
        await Genre.updateOne({ id: genre.id }, genre, { upsert: true });
      }

      const castIds = [];
      for (let c of credits.data.cast.slice(0, 5)) {
        await Cast.updateOne({ id: c.id }, {
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path
        }, { upsert: true });
        castIds.push(c.id);
      }

      await Movie.updateOne({ id: movie.id }, {
        id: movie.id,
        title: details.data.title,
        release_date: details.data.release_date,
        genres: genreIds,
        cast: castIds,
        popularity: details.data.popularity,
        vote_average: details.data.vote_average,
        vote_count: details.data.vote_count,
        revenue: details.data.revenue
      }, { upsert: true });
    }

    res.send("Movies fetched and stored.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching movies.");
  }
};

const getMovies = async (req, res) => {
  try {
    const {
      year,
      genres,
      without_genres,
      sort_by = 'popularity',
      order = 'desc',
      search,
      page = 1,
      limit = 20
    } = req.query;

    let filter = {};
    if (year) {
      filter.release_date = new RegExp(`^${year}`);
    }
    if (genres) {
      filter.genres = { $in: genres.split(',').map(Number) };
    }
    if (without_genres) {
      filter.genres = { $nin: without_genres.split(',').map(Number) };
    }
    if (search) {
      const castDocs = await Cast.find({ name: new RegExp(search, "i") });
      const castIds = castDocs.map(c => c.id);
      filter.$or = [
        { title: new RegExp(search, "i") },
        { cast: { $in: castIds } }
      ];
    }

    const movies = await Movie.find(filter)
      .sort({ [sort_by]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching movies");
  }
};

module.exports = { fetchAndStoreMovies, getMovies };
