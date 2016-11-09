var express = require("express");
var app = express();

var gcloud = require('google-cloud');
var datastore = gcloud.datastore;

var datastoreClient = datastore();
var key = datastoreClient.key('used_record');

function errorPrinter(err) {
  console.error(JSON.stringify(err, ["message", "stack"]));
}

app.post("/status", function(req, res) {
  var obj = {
    user_id : req.body.user_id,
    course : req.body.course,
    version : req.body.version,
    type : req.body.type,
    created_at : new Date()
  };
  datastoreClient.save({
    key : key,
    data : obj
  }, function(err) {
    if (err) {
      errorPrinter(err);
      res.json({result:"0"});
    } else {
      res.json({result:"1"});
    }
  });
});

var urls = [
  "http://wush978.github.io",
  "http://www.datascienceandr.org",
  "http://datascienceandr.org"
];
app.post("/getManyRecords", function(req, res) {
  if (err) {
    errorPrinter(err);
  } else {
    for(url in urls) {
      res.header("Access-Control-Allow-Origin", url);
    }
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json({});
  }
});

app.post("/getRecordsByUserId", function(req, res) {
  res.json({});
});

// init server
var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("DataScienceAndR Logging Server is at http://%s:%s", host, port);
});
