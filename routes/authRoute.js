const BASE_URI = "/api/v1";

const express = require('express');
const router = express.Router();
const {onAuthorization, onForgetPassword, onResetPassword} =require('../controllers/authController');

router.post(`${BASE_URI}/auth`, onAuthorization); 

router.patch(`${BASE_URI}/forgot-password`, onForgetPassword); 

router.patch(`${BASE_URI}/reset-password/:key`, onResetPassword); 


module.exports = router;

