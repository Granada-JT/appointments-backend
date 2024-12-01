const APPOINTMENT_MODEL = `
	INSERT INTO appointments (
		patient_name,
		appointment_start_date,
		appointment_end_date,
		appointment_start_time,
		appointment_end_time,
		comments
	)
	VALUES (?, ?, ?, ?, ?, ?)
`;

module.exports = {
  APPOINTMENT_MODEL,
};
