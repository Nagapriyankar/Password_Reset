const express = require('express')
const postController = require('../controllers/posts')
const authMiddleware = require('../middlewares/authMiddleware')

const postsRouter = express.Router()

postsRouter.post('/create', authMiddleware.verifyToken ,postController.create)


module.exports = postsRouter;

