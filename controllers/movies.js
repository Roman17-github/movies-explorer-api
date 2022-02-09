const movie = require('../models/movie');

const getMovies = (req, res) => {
    return movie.find({})
        .then((movie) => {
            res.status(200).send(movie);
        })
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createMovie = (req, res, next) => {
    const owner = req.user._id;
    const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;

    return movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
        .then((movie) => {
            res.status(200).send(movie);
        })
        .catch((er) => {
            const err = er;
            if (err.name === 'ValidationError') {
                err.statusCode = 400;
                err.message = 'неккоректные данные';
            }
            next(err);
        });
}

const deleteMovie = (req, res, next) => {
    return movie.findById(req.params._id)
        .orFail(() => {
            const error = new Error('Фильм не найден');
            error.name = 'FilmsNotFoundError';
            error.statusCode = 404;
            throw error;
        })
        .then(() => {
            if (req.user._id === movie.owner.toString()) {
                movie.deleteOne({ _id: movie._id })
                    .then(() => {
                        res.status(200).send({ message: 'Фильм удалён' })
                    })
            } else {
                const error = new Error('Нельзя удалить чужую карточку');
                error.name = 'ForbiddenError';
                error.statusCode = 403;
                throw error;
            }

        })
        .catch((er) => {
            const err = er;
            if (err.name === 'CastError') {
                err.statusCode = 400;
                err.message = 'неккоректный id';
            }
            next(err);
        });
}

module.exports = { getMovies, createMovie, deleteMovie }