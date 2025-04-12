const express = require("express");
const router = express.Router();
const { fetchAndStoreMovies, getMovies } = require("../controllers/movieController");

router.get("/fetch", fetchAndStoreMovies);
router.get("/", getMovies);

module.exports = router;
