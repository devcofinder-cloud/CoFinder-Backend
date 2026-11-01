const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../../controllers/User/ai.controller");
const { optionalVerifyToken } = require("../../middlewares/auth.middleware");

router.post("/chat", optionalVerifyToken, chatWithAI);

module.exports = router;
