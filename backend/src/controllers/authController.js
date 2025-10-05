const { prisma } = require("../db.js");

const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../helper/comparePassword.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); //สร้างtoken ที่มีid userฝังอยู่
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const securePassword = await hashPassword(password);
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All field are required" });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: securePassword,
      },
    });
    res.status(201).json({
      id: user.id,
      user,
      token: generateToken(user.id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All field are required" });
  }
  console.log(email);
  console.log(password);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    console.log(passwordMatch);

    res.status(200).json({
      id: user.id,
      user,
      token: generateToken(user.id),
      message: "Login success",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};
