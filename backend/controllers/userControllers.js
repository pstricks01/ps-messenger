const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const generateToken = require("../config/generateToken");
const User = require("../Models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the feilds");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (User) {
    res.status(201).json({
      _id: user._id,
      name: user._id,
      email: user.name,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create User");
  }
});

// login functionality
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // checking if user already exists or not
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user._id,
      email: user.name,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid ID or Password");
  }
});

module.exports = { registerUser, authUser };