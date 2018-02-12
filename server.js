const express = require('express');
const bodyParser = require('body-parser');
const GoogleImages = require('google-images');
const db = require('./database.js');

if(process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/:query', async (req,res) => {
	const page = req.query.offset || 1;
	const images = await client.search(req.params.query, { page });

	db.addQuery(req.params.query);

	res.json(images.map(image => {
		let { url, description, thumbnail, parentPage } = image;
		const snippet = description;
		const context = parentPage;
		thumbnail = thumbnail.url;

		return ({ url, snippet, thumbnail, context });
	}));
});

app.get('*', (req,res) => {
	res.send('This is a Backend-Only app, future developments pending');
});

app.listen(process.env.PORT || 3000);