const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	department: String,
	salary: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
