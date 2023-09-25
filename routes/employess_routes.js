const express = require("express");

const router = express.Router();

const Employee = require("../models/employees_model");

const verifyToken = require("../middleware/auth_middleware");

router.post("/employees", verifyToken, async (req, res) => {
	try {
		const { firstName, lastName, email, department, salary } = req.body;

		const newEmployee = new Employee({
			firstName,
			lastName,
			email,
			department,
			salary,
		});

		await newEmployee.save();

		res
			.status(201)
			.send({ message: "Employee created successfully", data: newEmployee });
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: err.message });
	}
});

router.get("/employees", verifyToken, async (res, req) => {
	try {
		const {
			page = 1,
			limit = 5,
			sortField = "firstName",
			sortOrder = "async",
			departmentFilter = "",
			searchQuerry = "",
		} = req.querry;

		const skip = (page - 1) * limit;
		const sort = {};
		sort[sortField] = sortOrder === "asc" ? 1 : -1;

		const query = {};
		if (departmentFilter) {
			query.department = departmentFilter;
		}

		if (searchQuerry) {
			query.$or = [
				{
					firstName: {
						$regex: searchQuerry,
						$option: "i",
					},
				},
			];
		}

		const totalEmployees = await Employee.countDocuments(query);
		const employee = await Employee.find(query)
			// .sort(sort)
			// .skip(skip)
			// .limit(parseInt(limit));

		res.status(201).send({ totalEmployees, employee });
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: err.message });
	}
});

router.patch("/employees/:id", verifyToken, async (req, res) => {
	try {
		const { id } = req.params;
		const { firstName, lastName, email, department, salary } = req.body;

		const updatedEmployee = await Employee.findByIdAndUpdate(
			id,
			{
				firstName,
				lastName,
				email,
				department,
				salary,
			},
			{ new: true },
		);

		if (!updatedEmployee) {
			return res.status(204).send({ message: "Employee not found." });
		}

		res.status(201).send({
			message: "Employee updated successfully.",
			employee: updatedEmployee,
		});
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: err.message });
	}
});

router.delete("/employees/:id", verifyToken, async (req, res) => {
	try {
		const { id } = req.params;

		const deletedEmployee = await Employee.findByIdAndDelete(id);
		if (!deletedEmployee) {
			return res.status(204).send({ message: "Employee not found." });
		}

		res.status(201).send({
			message: "Employee deleted successfully.",
			employee: deletedEmployee,
		});
	} catch (err) {
		console.log(err);
		res.status(401).send({ message: err.message });
	}
});


module.exports=router
