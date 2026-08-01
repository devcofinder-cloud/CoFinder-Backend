const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "technology",
        "design",
        "marketing",
        "sales",
        "management",
        "finance",
      ],
    },

    type: {
      type: String,
      enum: ["text", "textarea", "radio", "checkbox", "select", "number"],
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
  },
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

    categoryScores: {
      technology: { type: Number, default: 0 },
      design: { type: Number, default: 0 },
      marketing: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      management: { type: Number, default: 0 },
      finance: { type: Number, default: 0 },
    },

    archetype: {
      type: String,
      default: "",
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
  },
);

const Question = mongoose.model("Question", questionSchema);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = {
  Question,
  Questionnaire,
};
