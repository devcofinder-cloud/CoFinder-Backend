const express = require("express");

const {
  addToWaitlist,
} = require("../../controllers/User/waitList.controller");

const router = express.Router();

router.post("/join", addToWaitlist);

module.exports = router;