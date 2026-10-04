const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  avatar: {
    type: String,
    default: ''
  },

  password: {
    type: String,
    required: true
  },
  emailVerified: {
  type: Boolean,
  default: false
},
emailVerificationOtp: {
  type: String,
  default: null
},

emailVerificationOtpExpires: {
  type: Date,
  default: null
},
  brandKit: {
  name: {
    type: String,
    default: ''
  },
  tagline: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: ''
  },
  secondaryColor: {
    type: String,
    default: ''
  },
  accentColor: {
    type: String,
    default: ''
  },
  fontFamily: {
    type: String,
    default: ''
  },
  logoUrl: {
    type: String,
    default: ''
  }
}
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);