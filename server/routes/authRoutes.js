const express = require("express");
const { getLinkedInAccessToken } = require("../controllers/authController");

const router = express.Router();

router.post("/get-linkedin-access-token", getLinkedInAccessToken);

module.exports = router;
