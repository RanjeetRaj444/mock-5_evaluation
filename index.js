const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user_routes");
const employeeRoutes = require("./routes/employess_routes");
const auth_middleware = require("./middleware/auth_middleware");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/api", auth_middleware, employeeRoutes);

app.listen(process.env.PORT, async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("database is connected");
		console.log("app is listening on", process.env.PORT);
	} catch (err) {
		console.log({ err: err.message });
	}
});
