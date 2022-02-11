const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../utils/validation');

router.get('/movies/', getMovies);
router.post('/movies/', createMovieValidation, createMovie);
router.delete('/movies/:_id', deleteMovieValidation, deleteMovie);

module.exports = router;
