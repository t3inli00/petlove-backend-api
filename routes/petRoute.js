const BASE_URI = "/api/v1";

const express = require("express");
const router = express.Router();
const { AuthMiddleware } = require('../middlewares/authMiddleware')
const { onPetRegistrationCreate, onGetPetByCategory, onUpdateLikes,onGetPetCategories } = require("../controllers/petController.js");

//Create pet registration record in the pet table
router.post(`${BASE_URI}/pet-registration`, AuthMiddleware,  onPetRegistrationCreate);

//Find category record from pet_category table (id will be passed as a path param)
router.get(`${BASE_URI}/pet-search-by-category/:id`, onGetPetByCategory); 

//Find category record from pet likes table (id will be passed as a path param)
router.patch(`${BASE_URI}/pet-like/:id`, onUpdateLikes); 

//Find all category records from pet_category table
router.get(`${BASE_URI}/pet-category`, onGetPetCategories); 

module.exports = router;
