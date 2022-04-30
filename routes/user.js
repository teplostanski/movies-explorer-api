const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/user');

router.get('users/me', getUserInfo);

router.patch(
  'users/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

module.exports = router;
