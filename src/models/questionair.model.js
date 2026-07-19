const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "radio",
        "checkbox",
        "select",
        "number",
      ],
      default: "text",
    },

    options: [
      {
        type: String,
      },
    ],

    required: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ================= Questionnaire Schema =================

const questionnaireSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },

        answer: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


const Question = mongoose.model("Question", questionSchema);

const Questionnaire = mongoose.model(
  "Questionnaire",
  questionnaireSchema
);


module.exports = {
  Question,
  Questionnaire,
};