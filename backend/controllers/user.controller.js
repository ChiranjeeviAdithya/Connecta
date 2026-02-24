import { User } from "../models/users.models.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";

import crypto from "crypto";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

export const register = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ username });

    if (existing) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPass,
    });

    await newUser.save();

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};
