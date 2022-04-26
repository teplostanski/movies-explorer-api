const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../utils/regexp');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(regExp).required(),
    trailerLink: Joi.string().pattern(regExp).required(),
    thumbnail: Joi.string().pattern(regExp).required(),
    movieId: Joi.string().hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({ _id: Joi.string().hex().required() }),
}), deleteMovie);

module.exports = router;
