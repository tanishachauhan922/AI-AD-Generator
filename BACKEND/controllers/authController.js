const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendVerificationEmail } = require("../utils/sendEmails");

// ================= SIGNUP =================
// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[^A-Za-z0-9\s]/.test(password)
    ) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include an uppercase letter and a special character"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("SIGNUP ERROR: JWT_SECRET is not configured");
      return res.status(503).json({
        message: "Sign up is temporarily unavailable due to server configuration"
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists. Please sign in."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP valid for 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: otpExpires
    });

    // Generate the JWT before saving, so a signing/configuration error
    // cannot leave behind an account whose signup request failed.
    // EMAIL VERIFICATION TEMPORARILY DISABLED FOR DEPLOYMENT
    // Re-enable this when a production Resend domain is configured.
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await user.save();

    // Keep attempting OTP delivery so verification can be re-enabled later.
    try {
      await sendVerificationEmail(cleanEmail, otp);
    } catch (emailError) {
      console.error("SIGNUP VERIFICATION EMAIL ERROR:", emailError);
    }

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists. Please sign in."
      });
    }

    return res.status(500).json({
      message: "Failed to create account"
    });
  }
};
//===========verifyEmail=================
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified"
      });
    }

    if (!user.emailVerificationOtp || !user.emailVerificationOtpExpires) {
      return res.status(400).json({
        message: "Verification OTP not found"
      });
    }

    // Check expiry
    if (new Date() > user.emailVerificationOtpExpires) {
      return res.status(400).json({
        message: "OTP has expired"
      });
    }

    // Check OTP
    if (user.emailVerificationOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Verification successful
    user.emailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpires = null;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);

    return res.status(500).json({
      message: "Failed to verify email"
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// ================= PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json(user);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// ================= UPDATE ACCOUNT PROFILE =================
const updateProfile = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Profile changes must be provided as an object" });
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
      if (typeof req.body.name !== "string" || !req.body.name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      updates.name = req.body.name.trim();
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "email")) {
      if (typeof req.body.email !== "string") {
        return res.status(400).json({ message: "A valid email is required" });
      }

      const email = req.body.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "A valid email is required" });
      }
      updates.email = email;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "avatar")) {
      if (typeof req.body.avatar !== "string" || req.body.avatar.length > 2048) {
        return res.status(400).json({ message: "Avatar URL must be 2048 characters or fewer" });
      }

      const avatar = req.body.avatar.trim();
      if (avatar) {
        try {
          const avatarUrl = new URL(avatar);
          if (!["http:", "https:"].includes(avatarUrl.protocol)) {
            return res.status(400).json({ message: "Avatar URL must use HTTP or HTTPS" });
          }
        } catch {
          return res.status(400).json({ message: "A valid avatar URL is required" });
        }
      }
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No profile changes provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({ message: "That email address is already in use" });
    }

    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// ================= UPDATE BRAND KIT =================
const updateBrandKit = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.brandKit = req.body;

    await user.save();

    return res.json({
      message: "Brand kit updated successfully",
      brandKit: user.brandKit
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};





module.exports = { signup, verifyEmail,login, getProfile, updateProfile, updateBrandKit,

};