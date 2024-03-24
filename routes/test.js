const BASE_URI = "/api/v1"

const express = require('express');
const { AuthMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(`${BASE_URI}/test`, AuthMiddleware, (req, res) => res.sendStatus(200));

module.exports = router;

