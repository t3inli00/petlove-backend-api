const { insertComment, getAllComments, getCommentAmount, deleteSpecificComment, editSpecifiedComment, insertReply, getAllReplies, getPetImage, deleteSpecificCommentReplies  } = require('../services/commentService.js');

// display all comments in the comment section
// get amount of comments in the comment section
const displayComments = async (req, res) => {
    const petId = req.params.petId;
    try {
    // get all the comments from the database and get the amount of comments
    const comments = await getAllComments(petId); 
    const commentAmount = await getCommentAmount(petId);

    res.status(200).json({comments, commentAmount});
    } catch (error) {
    console.error('Error displaying comments and their amounts:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
}

const displayCommentAmount = async (req, res) => {
    try {
        // get the amount of comments from the database
        const petId = req.params.petId;
        const commentAmount = await getCommentAmount(petId);
        res.status(200).json(commentAmount);
        } catch (error) {
        console.error('Error displaying amount of comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// make a new comment box after a comment is submitted & put the new comment into the database
const createComment = async (req, res) => {
    try {
        const { content, username, userId, petId } = req.body;

        if (!content || !username) {
            return res.status(400).json({ error: 'Both the comment and username are required.' });
        } else {
            const newComment = await insertComment(content, username, userId, petId);
            return res.status(200).json({ message: 'Comment submitted successfully', comments: newComment});
        }

    } catch (error) {
        res.statusMessage = error;
        console.error('Error submitting comment:', error);
        res.status(500).json({error: error});
    }
};

// delete specified comment
const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        // delete any replies the comment might have
        const result = await deleteSpecificCommentReplies(commentId);
        // console.log(result);
        // find the comment by ID and delete it
        const rowCount = await deleteSpecificComment(commentId);
        if (rowCount === 1) {
            res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
             res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}

// edit specified comment
const editComment = async (req, res) => {
    const commentId = req.params.commentId;
    const newCommentText = req.body.content;
    try {
        // find the comment by ID and edit the text within it
        if (newCommentText !== null && commentId !== null) {
        const result = await editSpecifiedComment(commentId, newCommentText);
        if (result.message === 'Comment edited successfully') {
            res.status(200).json({ message: 'Comment edited successfully' });
        } else {
            res.status(500).json({ error: 'Failed to edit comment.' });
        }
    } else {
        console.log("Need to have a value for commentId or details.");
    }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
} 

const createReply = async (req, res) => {
    try {
        const { username, replyContent, parentId } = req.body;

        if (username && replyContent && parentId) {
            await insertReply(username, replyContent, parentId);
            res.status(201).json({ message: 'Reply added successfully' });
        } else {
            res.status(400).json({ error: 'Missing required parameters when adding a new reply' });
        }
    } catch (error) {
        console.error('Error adding reply to the database:', error);
        res.status(500).json({ error: 'Failed to add reply to the database' });
    }
}

const displayReplies = async (req, res) => {
    const petId = req.params.petId;
    try {
        // get all the replies from the database
        const replies = await getAllReplies(petId);
    
        res.status(200).send(replies); // changed from ( { replies } );
        } catch (error) {
        console.error('Error displaying replies:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
}

const displayImage = async (req, res) => {
    const petId = req.params['id'];

    if (!petId) {
        return res.status(400).send("Invalid request, pet ID required");
    }

    try {
        // get pet image
        const result = await getPetImage(petId);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    createComment, displayComments, deleteComment, displayCommentAmount, editComment, createReply, displayReplies, displayImage
};
