"use strict";

const express = require('express');

const router = express.Router();

const postsController = require('../controllers/postsController');

// / => GET
router.get('/', postsController.getPosts);

// /post/`postId => GET
router.get('/post/:postId', postsController.getPost);

// /post/post => POST
router.post('/post/', postsController.createPost);

// /post/post => PUT
router.put('/post/', postsController.updatePost);

// /post/:postId => DELETE
router.delete('/post/:postId', postsController.deletePost);

module.exports = router;
// exports.routes = router;

