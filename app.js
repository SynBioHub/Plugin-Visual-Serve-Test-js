const express = require('express')
const fs = require('fs');
const app = express();
const path = require('path');
const http = require('http');
const https = require('https');
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
	var data =  JSON.stringify(req.body)
	var rdf_type = req.body.type.toString()
	
	////////REPLACE THIS SECTION WITH OWN RUN CODE ////////////
	acceptable = true
	//////////////////END SECTION//////////////////////////////
	
	if (acceptable) {
		res.status(200).send(`The type sent (${rdf_type}) is an accepted type`);
	} else {
		res.status(415).send(`The type sent (${rdf_type}) is NOT an accepted type`);
	};
})

app.post('/Run', async function (req, res) {
	let hostHeader = req.get('host');
	let hostAddr;


	var complete_sbol = req.body.complete_sbol.toString();
	var url = complete_sbol.replace("/sbol", "");
	var token = (typeof req.body.token === 'undefined' || req.body.token === null) ? undefined : req.body.token.toString();

	var tokenVal = (typeof token === 'undefined' || token === null) ? 'null' : token;
		var headers = { 'Accept': 'text/plain' };
		if (tokenVal !== 'null') {
			headers['X-authorization'] = tokenVal;
		}

		var responseStatusCode = 'ERROR';
		if (typeof fetch === 'function') {
			var response = await fetch(url, { method: 'GET', headers: headers });
			responseStatusCode = response.status;
		} else {
			// Fallback for older Node: use http/https without changing control flow elsewhere.
			responseStatusCode = await new Promise(function(resolve) {
				var client = url.startsWith('https://') ? https : http;
				var req2 = client.get(url, { headers: headers }, function(r) {
					r.on('data', function(){});
					r.on('end', function(){ resolve(r.statusCode); });
				});
				req2.on('error', function(){ resolve('ERROR'); });
			});
		}

	// determine SEQVIZ script URL (respect SERVER_HOST env override)
	const overrideHost = process.env.SERVER_HOST;
	if (overrideHost) {
		const o = overrideHost.replace(/\/+$/,''); // strip trailing slashes
		if (o.startsWith('http://') || o.startsWith('https://')) {
			hostAddr = o;
		} else {
			hostAddr = 'http://' + o;
		}
	} else {
		hostAddr = 'http://' + hostHeader;
	}

	// this works if you can access the plugin via an exposed port on the internet.
	// Note that for synbiohub it must be https
	// <img src="http://${hostAddr}/public/success.jpg" alt="Success">
	const html_read = `<!doctype html>
	<html>
	<head><title>sequence view</title>
	<script src="${hostAddr + '/seqviz.js'}"></script></head>
	<body>
	<p>Response from ${url}: ${responseStatusCode}</p>
	<div id="reactele"></div>
	<img src="${hostAddr + '/public/success.jpg'}" alt="Success">
	<p>Host address: ${hostAddr}</p>
	</body>
	</html>
	`;

	res.send(html_read);

})

app.listen(port, () => console.log(`Test Serve app is listening at http://localhost:${port}`))
