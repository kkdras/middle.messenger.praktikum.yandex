const express = require('express');
const path = require('node:path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', async (_req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`start listening server on ${PORT} port`);
});
