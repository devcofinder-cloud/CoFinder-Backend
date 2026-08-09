const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    setNumber: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },

    options: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProfileQuestionSet", questionSchema);