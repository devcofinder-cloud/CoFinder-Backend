const express = require("express");

const {
  addToWaitlist,getWaitlist
} = require("../../controllers/User/waitList.controller");

const router = express.Router();

router.post("/join", addToWaitlist);
router.get("/", getWaitlist);

module.exports = router;