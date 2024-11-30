const { initDatabase } = require ("../config/database");
const { APPOINTMENT_MODEL } = require("../models/appointment");

const db = initDatabase();

exports.getAppointments = async(req, res) => {
	const sql = `
		SELECT * FROM appointments
		ORDER BY appointment_start_date, appointment_start_time
	`;

	db.all(sql, [], (error, rows) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ error: "Failed to fetch appointments" });
		}
		return res.status(200).json(rows);
	});
}

exports.createAppointment = async(req, res) => {
	const {
		patientName,
		appointmentStartDate,
		appointmentEndDate,
		appointmentStartTime,
		appointmentEndTime,
		comments,
	} = req.body;

	if (
		!patientName ||
		!appointmentStartDate ||
		!appointmentEndDate ||
		!appointmentStartTime ||
		!appointmentEndTime
	) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const overlapQuery = `
		SELECT * FROM appointments
		WHERE 
			appointment_start_date = ?
			AND appointment_start_time < ?
			AND appointment_end_time > ?
	`;

	db.get(
		overlapQuery,
		[appointmentStartDate, appointmentEndTime, appointmentStartTime],
		(error, row) => {
			if (error) {
				console.error(error)
				return res.status(500).json({ error: "Error checking for overlaps" });
			}

			if (row) {
				return res.status(400).json({ error: "Overlapping appointment exists" });
			}

			db.run(
				APPOINTMENT_MODEL,
				[
					patientName,
					appointmentStartDate,
					appointmentEndDate,
					appointmentStartTime,
					appointmentEndTime,
					comments,
				],
				(error) => {
					if (error) {
					return res.status(500).json({ error: "Failed to create appointment" });
					}
					res.status(201).json({ message: "Appointment created successfully" });
				}
			);
		}
	);
}

exports.editAppointment = async(req, res) => {
	const { id } = req.params;
	const {
		patientName,
		appointmentStartDate,
		appointmentEndDate,
		appointmentStartTime,
		appointmentEndTime,
		comments
	} = req.body;

	if (!id) {
		return res.status(400).json({ error: "Appointment ID is required" });
	}

	const sql = `
		UPDATE appointments
		SET
			patient_name = ?,
			appointment_start_date = ?,
			appointment_end_date = ?,
			appointment_start_time = ?,
			appointment_end_time = ?,
			comments = ?
		WHERE id = ?
	`;

	db.run(
		sql,
		[
			patientName,
			appointmentStartDate,
			appointmentEndDate,
			appointmentStartTime,
			appointmentEndTime,
			comments,
			id,
		],
		function (error) {
			if (error) {
				console.error(error)
				return res.status(500).json({ error: "Failed to update appointment" });
			}
			if (this.changes === 0) {
				return res.status(404).json({ error: "Appointment not found" });
			}
			res.status(200).json({ message: "Appointment updated successfully" });
		}
	);
}

exports.deleteAppointment = async(req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: "Appointment ID is required" });
	}

	const sql = `
		DELETE FROM appointments
		WHERE id = ?
	`;

	db.run(sql, [id], function (error) {
		if (error) {
			console.error(error)
			return res.status(500).json({ error: "Failed to delete appointment" });
		}
		if (this.changes === 0) {
			return res.status(404).json({ error: "Appointment not found" });
		}
		res.status(200).json({ message: "Appointment deleted successfully" });
	});
}
