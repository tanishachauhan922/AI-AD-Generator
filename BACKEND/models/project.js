const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },
     status: {
  type: String,
  enum: ["Active", "Completed"],
  default: "Active"
},
    type: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String
    },

    videoUrl: {
      type: String
    },
    prompt: {
  type: String
},

duration: {
  type: Number
},

aspectRatio: {
  type: String
},
magicHourProjectId: {
  type: String
},

    headline: {
      type: String
    },

    criticScore: {
      type: Number,
      min: 0,
      max: 100
    },

    subtext: {
      type: String
    },

    cta: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);