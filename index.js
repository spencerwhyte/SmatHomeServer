var express = require("express");
var app = express();
var request = require('request');
var bodyParser = require("body-parser");

var url = 'https://spencerwhyte.cloudant.com/'
var db = 'heart/'
var id = 'f9973dc73cf606063b42bd5ab32d51d0'

var username = 'spencerwhyte'
var password = 'happygilmore123'

var options = {
  url: url + db + id,
  auth: {
    user: username,
    password: password
  }
}

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public')); 

app.get("/data", function(req, res) {
	request(options, function (err, res2, body) {
		console.dir('headers', res2.headers)
		console.dir('status code', res2.statusCode)
		console.dir(body)
		var responseObject = JSON.parse(body);
		console.dir(responseObject.heart_rate);
		res.send('{ "heart_rate" : ' + JSON.stringify(responseObject.heart_rate) + '}');
	
	});
});
 
app.post("/data", function(req, res) { 

	console.dir(req.body);	

	var new_hr = req.body.new_hr;

	request(options, function (err, res2, body) {

		var responseObject = JSON.parse(body);
                console.dir(responseObject.heart_rate);
               	heart_rate = responseObject.heart_rate;
		if(heart_rate.length > 50){
			heart_rate.shift();
		}
		heart_rate.push([heart_rate[heart_rate.length - 1][0] + 1 , new_hr]);

		var updated_data = {"_rev": responseObject._rev,  "heart_rate": heart_rate}
	
		var options2 = JSON.parse(JSON.stringify(options));
		
		options2["method"] = "PUT";
		options2["json"] = updated_data;
	
		console.dir("Finished GET");
	
		request(options2, function (err, res2, body) {
			console.dir("PUT FINISHED");
			//console.dir("FINAL");
			//console.dir(body);
			//console.dir(err);
			//console.dir(res2);
			res.status(200);
			res.send({"success" : 1});
		});	

        });

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

