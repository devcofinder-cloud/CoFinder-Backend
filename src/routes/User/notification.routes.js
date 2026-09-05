const express = require("express");

const router = express.Router();

const {
  testPushNotification,
} = require("../../controllers/User/notification.controller");

// ============================================
// TEST PUSH NOTIFICATION
// ============================================

// Send test push notification
router.post(
  "/test-push",
  testPushNotification
);


module.exports = router;