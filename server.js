const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// TODO: Add routes here

if (require.main === module) {
	app.listen(process.env.PORT, () => {
		console.log(`Server is now running in port ${process.env.PORT}`)
	})
}

module.exports = { app };
