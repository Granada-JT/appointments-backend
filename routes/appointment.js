const express = require("express");
const {
	getAppointments,
	createAppointment,
	editAppointment,
	deleteAppointment
} = require("../controllers/appointmentController")
const router = express.Router();

router.get("/", getAppointments);

router.post("/create", createAppointment);

router.patch("/edit/:id", editAppointment);

router.delete("/delete/:id", deleteAppointment);

module.exports = router;
