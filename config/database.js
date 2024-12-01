const sqlite3 = require("sqlite3");

let db;

const initDatabase = () => {
  if (!db) {
    db = new sqlite3.Database(":memory:", (error) => {
      if (error) {
        console.error("Error Connecting to SQLite database:", error);
      } else {
        console.log("Connected to SQLite in-memory database.");
      }
    });

    db.run(
      `
			CREATE TABLE appointments (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			patient_name TEXT NOT NULL,
			appointment_start_date TEXT NOT NULL,
			appointment_end_date TEXT NOT NULL,
			appointment_start_time TEXT NOT NULL,
			appointment_end_time TEXT NOT NULL,
			comments TEXT
		)
		`,
      (error) => {
        if (error) {
          console.error("Error creating table:", error);
        } else {
          console.log("Appointments table created successfully.");
        }
      },
    );
  }

  return db;
};

module.exports = { initDatabase };
