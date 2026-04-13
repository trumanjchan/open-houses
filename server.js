const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const port = 3000;

const { db, connectToDB } = require('./apis/db');
const saltRounds = 10;
const { getResults } = require('./apis/zillow-realtyapi');


(async () => {
    try {
        await connectToDB();
        await db.query("SELECT 1");

        setInterval(async () => {
            try {
                await db.query('SELECT 1');
                console.log("Pinged DB to keep it warm");
            } catch (err) {
                console.error("Ping failed:", err);
            }
        }, 4 * 60 * 1000);

		app.use(express.static(path.join(__dirname, "public")));
		app.use(express.json());

		app.get("/", (req, res) => {
			res.sendFile(path.join(__dirname, "public", "index.html"));
		});

		app.post("/api/login", async (req, res) => {
			try {
				const { username, password } = req.body;

				const [user] = await db.query(`SELECT * FROM users WHERE name = ?`, [username]);

				const nick = username;
				const normalized = nick.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
                const isAscii = /^[A-Za-z0-9\s\-]+$/.test(normalized);
                const byteLength = new TextEncoder().encode(nick).length;

				if ((nick === nick.trim()) && (normalized && isAscii) && (nick.length <= 20) && (byteLength <= 80)) {
					if (user.length > 0) {
						const bool = bcrypt.compareSync(password, user[0].password);
						if (bool) {
							const lists = await db.query(`SELECT * FROM lists WHERE user_id = ?`, [user[0].id]);
							res.json({
								user: {
									id: user[0].id,
									name: user[0].name
								},
								lists
							});
							console.log("User logged in:", nick);
						} else {
							return res.status(401).json({ error: "Incorrect password" });
						}
					} else {
						const hash = bcrypt.hashSync(password, saltRounds);

						const [insertResult] = await db.query(`INSERT INTO users (name, password) VALUES (?, ?)`, [nick, hash]);
						const [lists] = await db.query(`SELECT * FROM lists WHERE user_id = ?`, [insertResult.insertId]);
						res.json({
							user: {
								id: insertResult.insertId,
								name: nick
							},
							lists
						});
						console.log("New user registered:", nick);
					}
				}
			} catch (error) {
				console.error('API route error:', error);
				res.status(500).json({ error: 'Failed to fetch data' });
			}
		});

		app.post("/api/search", async (req, res) => {
			try {
				const { location, listingstatus, min, max, tourOpenHouse, tour3D } = req.body;

				const result = await getResults(location, listingstatus, min, max, tourOpenHouse, tour3D);
				res.json(result);
			} catch (error) {
				console.error('API route error:', error);
				res.status(500).json({ error: 'Failed to fetch data' });
			}
		});

		app.post("/api/save-list", async (req, res) => {
			try {
				const { user_id, title, list } = req.body;

				await db.query(`INSERT INTO lists (user_id, title, list) VALUES (?, ?, ?)`, [user_id, title, JSON.stringify(list)]);

				res.json({ success: true });
			} catch (error) {
				console.error('API route error:', error);
				res.status(500).json({ error: 'Failed to save list' });
			}
		});

		app.get("/:name/list/:id", async (req, res) => {
			res.sendFile(path.join(__dirname, "public", "index.html"));
		});

		app.get("/api/:name/list/:id", async (req, res) => {
			const { name, id } = req.params;

			const [rows] = await db.query(
				`
				SELECT lists.id, lists.title, lists.list
				FROM lists
				JOIN users ON lists.user_id = users.id
				WHERE users.name = ?
				AND lists.id = ?
				`,
				[name, id]
			);

			res.json(rows[0]);
		});

		app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});

	} catch (err) {
        console.error('Failed to start server due to DB error:', err);
        process.exit(1);
    }
})();