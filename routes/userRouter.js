const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/users', userController);

module.exports = userRouter;
