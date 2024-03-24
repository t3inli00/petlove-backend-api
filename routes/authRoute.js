const BASE_URI = "/api/v1";

const express = require('express');
const router = express.Router();
const {onAuthorization} =require('../controllers/authController');

router.post(`${BASE_URI}/auth`, onAuthorization); 

module.exports = router;

