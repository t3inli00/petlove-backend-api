const BASE_URI = "/api/v1";

const express = require('express');
const router = express.Router();
const {onGetHistories, onGetHistoriesByRange} = require('../controllers/historyController');
const { AuthMiddleware } = require('../middlewares/authMiddleware')

// Find history records of the target user in the indicated date
router.get(`${BASE_URI}/history`, AuthMiddleware, onGetHistoriesByRange); 

//Find all history records of the target user
router.get(`${BASE_URI}/history/:id`, AuthMiddleware, onGetHistories); 

module.exports = router;