const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = async (req, res, next) => {
	const token = req.header("Authorization");

	if (!token) {
		return res
			.status(401)
			.send({ message: "Authentication failed.Token missing" });
	}

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET_KRY);

		req.userData = {
			userId: decodedToken.userId,
			email: decodedToken.email,
		};
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).send({
			message: "Authentication failed. Invalid token.",
		});
	}
};


module.exports=verifyToken