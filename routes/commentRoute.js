const BASE_URI = "/api/v1";

const express = require('express');
const router = express.Router();
const { createComment, displayComments, deleteComment, displayCommentAmount, editComment, createReply, displayReplies, displayImage } = require('../controllers/commentController.js');

// GET route to fetch comments from the database
router.get(`${BASE_URI}/comments/:petId`, displayComments); 

// DELETE route to delete a comment
router.delete(`${BASE_URI}/comments/:commentId`, deleteComment);

// POST route to insert a new comment into the database & show it on the browser
router.post(`${BASE_URI}/comments/`, createComment);

// GET route to fetch the amount of comments currently present
router.get(`${BASE_URI}/comments/amount/:petId`, displayCommentAmount); 

// PUT route to edit a comment
router.put(`${BASE_URI}/comments/:commentId`, editComment);

// POST route to insert replies to the database
router.post(`${BASE_URI}/comments/replies/new/:parentId`, createReply);

// GET all replies from the database
router.get(`${BASE_URI}/comments/replies/:petId`, displayReplies);

// GET image from the database
router.get(`${BASE_URI}/comments/image/:id`, displayImage);


module.exports = router;