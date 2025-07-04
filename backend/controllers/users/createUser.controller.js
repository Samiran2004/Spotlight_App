// controllers/users/createUser.controller.js
import express from 'express';
import User from '../../models/users.models.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import userAuth from '../../middlewares/userAuthMiddleware.js';

const router = express.Router();

router.post('/create-user', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullname}`
    const newUser = new User({ fullname, email, password: hashedPassword, profileImage: profileImage });
    await newUser.save();

    const token = JWT.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  console.log("Hit login route");
  console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'Failed',
        message: "All fields are required"
      });
    }

    // Check user is exist or not...
    const existUser = await User.findOne({ email: email });

    console.log(existUser);

    if (!existUser) {
      return res.status(400).json({
        status: 'Failed',
        message: "User not exist"
      });
    }

    const isValidPassword = await bcrypt.compare(password, existUser.password);
    console.log(isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json({
        status: 'Failed',
        message: "Email or Password is not valid",
      });
    }

    const token = JWT.sign({ email: email, _id: existUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(token);

    return res.status(200).json({
      status: 'Ok',
      message: "Login successful",
      token,
      user: existUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Failed',
      message: "Internal Server Error"
    });
  }
});

router.post("/update", userAuth, async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name && !bio) {
      return res.status(400).json({
        status: 'Failed',
        message: "Please provide at least one field to update."
      });
    }

    let fullname = name;

    // Build update object dynamically
    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (bio) updateFields.bio = bio;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 'Failed',
        message: "User not found."
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json({
      status: 'Ok',
      message: "Profile updated successfully.",
      user: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Failed',
      message: "Internal Server Error."
    });
  }
});

export default router;