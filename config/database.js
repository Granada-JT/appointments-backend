const sqlite3 = require("sqlite3");

const initDatabase = () => {
	const db = new sqlite3.Database(':memory:', (error) => {
		if (error) {
			console.error('Error Connecting to SQLite database:', error);
		} else {
			console.log('Connected to SQLite in-memory database.');
		}
	})

	return db;
}

module.exports = initDatabase;
