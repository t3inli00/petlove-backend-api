const express = require('express');
const healthCheck = require('./healthCheckRoute');
const auth = require('./authRoute');
const user = require('./userRoute');
const petCategory = require('./petCategoryRoute');
const pet = require('./petRoute');
const history = require('./historyRoute');
const request = require('./requestRoute');
const comment = require('./commentRoute');
const router = express.Router();

router.use(healthCheck);
router.use(auth);
router.use(user);
router.use(petCategory);
router.use(pet);
router.use(history);
router.use(request);
router.use(comment);

module.exports = router;

