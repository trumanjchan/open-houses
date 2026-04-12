const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const { getResults } = require('./apis/zillow-realtyapi');


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
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

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
