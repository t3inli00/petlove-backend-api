const BASE_URI = "/api/v1";

const express = require('express');
const { AuthMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router();
const {onRegister, onActivate, onFindOneUser, onFindUsers, onFindOneUserByKey} =require('../controllers/userControl');

router.post(`${BASE_URI}/users`, onRegister); 
router.patch(`${BASE_URI}/activate-me/:key`, onActivate); 
router.get(`${BASE_URI}/users/:userId`, AuthMiddleware, onFindOneUser); 
router.get(`${BASE_URI}/users`, AuthMiddleware, onFindUsers); 
router.get(`${BASE_URI}/user-by-key/:key`, onFindOneUserByKey); 

module.exports = router;