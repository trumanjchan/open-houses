const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
	ssl: {
    	minVersion: 'TLSv1.2'
    },
	waitForConnections: true,
	connectionLimit: 5,
	queueLimit: 0
})

async function connectToDB() {
	try {
		await db.query(`
			CREATE TABLE IF NOT EXISTS users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(20) CHARACTER SET utf8mb4 UNIQUE NOT NULL,
				password VARCHAR(60) NOT NULL
			)
		`);
		console.log("Users table confirmed.");

		await db.query(`
			CREATE TABLE IF NOT EXISTS lists (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				title VARCHAR(255) NOT NULL,
				slug VARCHAR(255) NOT NULL,
				list JSON,
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
				UNIQUE KEY unique_user_slug (user_id, slug)
			)
		`);
		console.log("Lists table confirmed.");

	} catch (err) {
		console.error("Error initializing DB:", err);
		throw err;
	}
}

module.exports = {
	db,
	connectToDB
};