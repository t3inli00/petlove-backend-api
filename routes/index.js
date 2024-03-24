const express = require('express');
const healthCheck = require('./healthCheckRoute');
const auth = require('./authRoute');
const test = require("./test");

const router = express.Router();

router.use(healthCheck);
router.use(auth);
router.use(test);

module.exports = router;

