const express = require('express')
const os = require("os")
const fs = require('fs');
const app = express();
const http = require('http');
const path = require('path');
const port = 5000

app.use(express.json());

app.get('/download', function (req, res) {
	let file_path = path.join(__dirname, "DownloadTest.html")
	res.download(file_path, "Test.html", headers={})
})


app.get('/Status', function (req, res) {
	//read in html and substitute in the values extracted from the request above
	fs.readFile('StatusTest.html', function(err, data) {
		let x = os.hostname();
		let html_read = data.toString()
		html_read = html_read.replace(/URL_REPLACE/g, req.headers);
		html_read = html_read.replace(/endpoint/g, x);
		//html_read = html_read.replace(/URL_REPLACE/g, "http://localhost:5000/download");
		
		//return html
		res.send(html_read)
	});
})

app.post('/Evaluate', function (req, res) {
	res.status(200).send('The app can handle this input')
})

app.post('/Run', function (req, res) {
	
	//read in html and substitute in the values extracted from the request above
	//fs.readFile('StatusTest.html', function(err, data) {
	//	let html_read = data.toString()
	//	html_read = html_read.replace(/<Hello>/g,"hi");
	//	
	//	//return html
	//	res.send(html_read)
	//});
})

app.listen(port, () => console.log(`Test Visualisation app is listening at http://localhost:${port}`))
