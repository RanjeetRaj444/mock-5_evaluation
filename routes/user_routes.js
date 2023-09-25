const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user_Model");

//signup

router.post("/signup", async (req, res) => {
	try {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(200).send({
				message: "User already exists.",
			});
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			email,
			password: hashedPassword,
		});

		await newUser.save();

		res.status(201).send("Signup successfull");
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(200).send({ message: "Invalid credentials." });
		}

		//verify
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(200).send({ message: "Invalid credentials." });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
			},
			process.env.SECRET_KRY,
			{
				expiresIn: "1h",
			},
		);

		res.status(201).send({ message: "Login successfull.", token });
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: err.message });
	}
});

module.exports = router;
