require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./middlewares/auth');
// const regExp = require('./utils/regexp');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV } = process.env;

const app = express();

app.use(cors({
  origin: ['https://diplom.nomoredomains.xyz', 'http://diplom.nomoredomains.xyz', 'http://localhosh:3000'],
  allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Content-Type'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) {
    console.warn('Unable to connect to mongodb', err);
  }
});

app.use(requestLogger);

app.use(require('./routes/index'));

app.use(auth);
app.use(require('./routes/user'));
app.use(require('./routes/movie'));

app.post('/signout', (req, res) => {
  res.status(200).clearCookie('jwt', {
    domain: NODE_ENV === 'production' ? '.diplom.nomoredomains.xyz' : undefined,
    httpOnly: false,
    sameSite: false,
    secure: false,
  }).send({ message: 'Выход' });
});

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
  console.warn('App listening on port 3000');
});
