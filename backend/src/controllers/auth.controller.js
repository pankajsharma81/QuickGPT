const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


async function registerUser(req, res) {
    const { fullName:{firstName,lastName}, password, email } = req.body;

    const isUserAlreadyExists = await UserModel.findOne({ email})

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new UserModel({
        fullName: { firstName, lastName },
        password: await bcrypt.hash(password, 10),
        email,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    res.status(201).json({ message: "User registered successfully", user: newUser});
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Login successful", user });
}

module.exports = { registerUser, loginUser };