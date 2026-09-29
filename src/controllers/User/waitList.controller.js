const { joinWaitlist } = require("../../services/User/waitList.service");

const addToWaitlist = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    await joinWaitlist(email);

    return res.status(201).json({
      success: true,
      message: "You have successfully joined the waitlist.",
    });
  } catch (error) {
    console.error("Waitlist Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};

module.exports = {
  addToWaitlist,
};