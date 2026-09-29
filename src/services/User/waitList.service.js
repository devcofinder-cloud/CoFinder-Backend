const Waitlist = require("../../models/waitList.model");

const joinWaitlist = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await Waitlist.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("This email is already on the waitlist.");
    error.statusCode = 409;
    throw error;
  }

  const waitlistUser = await Waitlist.create({
    email: normalizedEmail,
  });

  return waitlistUser;
};

module.exports = {
  joinWaitlist,
};