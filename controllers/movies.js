const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const Movie = require('../models/movie');

const getMovies = (req, res) => {
  Movie
    .find({ owner: req.user._id })
    .then((m) => {
      res.status(200).send(m);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    .then((m) => {
      res.status(200).send(m);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неккоректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        return movie.deleteOne({ _id: movie._id }).then(() => {
          res.status(200).send({ message: 'Фильм удалён' });
        });
      }
      throw new ForbiddenError('Нельзя удалять чужой фильм');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Неккоректный id'));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, createMovie, deleteMovie };
