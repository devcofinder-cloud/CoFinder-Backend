const mongoose = require("mongoose");

const professionalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
    },

    currentRole: {
      type: String,
      trim: true,
    },

    currentCompany: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
    },

    experienceLevel: {
      type: String,
      trim: true,
    },

    skills: [
      {
        name: {
          type: String,
          trim: true,
        },
        level: {
          type: String,
          trim: true,
        },
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
        },
        role: {
          type: String,
          trim: true,
        },
        location: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],

    education: [
      {
        institution: {
          type: String,
          trim: true,
        },
        degree: {
          type: String,
          trim: true,
        },
        fieldOfStudy: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        technologies: [String],
        projectUrl: String,
        githubUrl: String,
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },
        issuingOrganization: {
          type: String,
          trim: true,
        },
        issueDate: Date,
        credentialId: String,
        credentialUrl: String,
      },
    ],

    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
      twitter: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProfessionalProfile",
  professionalProfileSchema
);