const express = require('express')
const fs = require('fs');
const app = express();
const path = require('path');
const port = 5000

app.use(express.json());
//app.use(express.static(path.join(__dirname, "public")));

app.get('/public/:file_name', function (req, res){
	let file_path = path.join(__dirname, 'public', req.params.file_name)
	res.sendFile(file_path,function(err){
		if(err){
			res.send('The this file ('+req.params.file_name +') does not exist');
			}
		});
})

app.get('/download', function (req, res) {
	let file_path = path.join(__dirname, "DownloadTest.html")
	res.download(file_path, "Test.html", headers={})
})


app.get('/Status', function (req, res) {
	//read in html and substitute in the values extracted from the request above
	fs.readFile('StatusTest.html', function(err, data) {
		let host_path = req.header('Host')
		host_path = "http://"+ host_path + "/download"
		let html_read = data.toString()
		html_read = html_read.replace(/URL_REPLACE/g, host_path);
		
		//return html
		res.send(html_read)
	});
})

app.post('/Evaluate', function (req, res) {
	res.status(200).send('The app can handle this input')
})

app.post('/Run', function (req, res) {
	let hostAddr = req.get('host')
	//this works if you can access the plugin via an exposed port on the internet. Note that for synbiohub it must be https
	//<img src="http://${hostAddr}/public/success.jpg" alt="Success">
	html_read = `<!doctype html>
	<html>
	<head><title>sequence view</title></head>
	<body>
	<div id="reactele"></div>
	<img src="http://localhost:8086/public/success.jpg" alt="Success">
	<p>Host address: ${hostAddr}</p>
	</body>
	</html>
	`;
	
	res.send(html_read)
	
})

app.listen(port, () => console.log(`Test Visualisation app is listening at http://localhost:${port}`))
