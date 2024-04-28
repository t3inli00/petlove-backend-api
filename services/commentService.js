const { queryDb } = require('../repository/queryDatabase');

// get all information from database
async function getAllComments(petId) {
    try {
        const result = await queryDb('select * from pet_review where id_pet = $1', [petId]);
        return result.rows;
    } catch(error) {
        // res.statusMessage = error;
        // res.status(500).json({error: error});
        throw new Error('Error fetching comments from the database: ' + error.message);
    }
}

// insert a comment & username (and all of its new rows) into the database
async function insertComment(content, username, userId, petId) {
    try {
        const insertionResult = await queryDb(
            `INSERT INTO pet_review (id_pet, review_details, reviewed_on, review_username, id_user) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *`,
            [petId, content, username, userId]
        );
        
        const insertedComment = insertionResult.rows[0];
        return insertedComment;
         
    } catch (error) {
        throw new Error('Error inserting comment into the database: ' + error.message);
    }
}

// get amount of comments
async function getCommentAmount(petId) {
    try {
        const result = await queryDb('SELECT COUNT(review_details) AS comment_count FROM pet_review where id_pet = $1', [petId]);
        return result.rows[0].comment_count;
    } catch (error) {
        console.error('Error fetching comment count from the database:', error);
        throw new Error('Error fetching comment count: ' + error.message);
    }
}

// find comment by id and delete it
async function deleteSpecificComment(id) {
    try {
        const queryText = 'DELETE FROM pet_review WHERE id_pet_review = $1';
        const result2 = await queryDb(queryText, [id]);
        return result2.rowCount;
    } catch (error) {
        console.error('Error deleting specified comment from the database:', error);
        throw new Error('Error deleting specified comment:' + error.message);
    }
}

// edit specific comment
async function editSpecifiedComment(id, text) {
    try {
        const result = await queryDb('UPDATE pet_review SET review_details = $1 WHERE id_pet_review = $2', [text, id]);
    
        if (result.rowCount === 1) {
            return { message: 'Comment edited successfully' };
        } else {
            throw new Error('Comment not found');
        }
    } catch (error) {
        console.error('Error editing comment:', error);
        throw new Error('Failed to edit comment');
    }
} 

async function insertReply(username, replyContent, parentId) {
    try {
        const insertionResult = await queryDb(
            `INSERT INTO pet_replies (id_pet_review, reply_username, reply_details) VALUES ($1, $2, $3) RETURNING *`,
            [parentId, username, replyContent]
        );
        
        const insertedReply = insertionResult.rows[0];
        console.log("what is the inserted reply: " + insertedReply);
        return insertedReply;
    } catch (error) {
        throw new Error('Error inserting reply into the database: ' + error.message);
    }
}

async function getAllReplies(idPet) {
    try {
        const result = await queryDb('SELECT * FROM pet_replies');
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching replies from the database: ' + error.message);
    }
}

async function getPetImage(petId) {
    try {
        const result = await queryDb(`SELECT image_path from pet_image WHERE id_pet = $1`, [petId]);
        const resultRows = result.rows ? result.rows : [];
        return !resultRows? [{}]: resultRows;
    } catch(error) {
        throw new Error(error.message);
    }
}

const deleteSpecificCommentReplies = async (commentId) => {
    try {
        console.log(commentId);
        const result = await queryDb(`DELETE FROM pet_replies WHERE id_pet_review = $1`, [commentId]);
        console.log(result);
        return result.rowCount > 0; 
    } catch (error) {
        throw error; 
    }
};

module.exports = {
    insertComment, getAllComments, getCommentAmount, deleteSpecificComment, editSpecifiedComment, insertReply, getAllReplies, getPetImage, deleteSpecificCommentReplies
};

