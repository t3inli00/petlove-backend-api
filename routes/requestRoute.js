const BASE_URI = "/api/v1";

const express = require('express');
const router = express.Router();
const {onGetPetDetails, onSendRequestEmail, onGetPetDetailsWithAdoptRequest, onAcceptAdoptRequest, onRejectAdoptRequest} = require('../controllers/requestController');
const { AuthMiddleware } = require('../middlewares/authMiddleware')

// Find pet details
router.get(`${BASE_URI}/request/:id`, onGetPetDetails); 

// Send request email to the owner
router.post(`${BASE_URI}/request`, AuthMiddleware, onSendRequestEmail); 

router.get(`${BASE_URI}/adopt/:id`, onGetPetDetailsWithAdoptRequest); 

router.post(`${BASE_URI}/accept-request/:id`, onAcceptAdoptRequest); 

router.post(`${BASE_URI}/reject-request/:id`, onRejectAdoptRequest); 

module.exports = router;