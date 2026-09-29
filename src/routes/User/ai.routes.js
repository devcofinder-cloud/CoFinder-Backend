const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../../controllers/User/ai.controller");

router.post("/chat", chatWithAI);

module.exports = router;