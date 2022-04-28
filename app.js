require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
// const cors = require('cors');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
// const regExp = require('./utils/regexp');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

//  app.use(cors({
//    origin: ['https://diplom.nomoredomains.xyz', 'http://diplom.nomoredomains.xyz'],
// eslint-disable-next-line max-len
//    allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Content-Type'],
//    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//    credentials: true,
//  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    console.error('Unable to connect to mongodb', err);
  }
});

app.use(requestLogger);

//  app.get('/crash-test', () => {
//    setTimeout(() => {
//      throw new Error('Сервер сейчас упадёт');
//    }, 0);
//  });

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

//  app.post('/signout', (req, res) => {
//    res.status(200).clearCookie('jwt', {
//      domain: '.diplom.nomoredomains.xyz',
//      httpOnly: true,
//      sameSite: true,
//      secure: true,
//    }).send({ message: 'Выход' });
//  });

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.send({ message: err.message || 'Неизвестная ошибка' });
  next();
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
