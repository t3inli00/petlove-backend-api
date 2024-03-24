const BASE_URI = "/api/v1"

const express = require('express');
const router = express.Router();

router.get(`${BASE_URI}/healthcheck`, (req, res) => res.sendStatus(200));

module.exports = router;

