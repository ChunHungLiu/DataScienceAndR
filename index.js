var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());


var gcloud = require('google-cloud')({
  projectId : "datascienceandr"
});
var datastoreClient = gcloud.datastore();

function errorPrinter(err) {
  console.error(JSON.stringify(err, ["message", "stack"]));
}

var router = express.Router();

router.use(function(req, res, next) {
  // debugger;
  console.log("Receive request: " + JSON.stringify({
    "method" : req.method,
    "originalUrl" : req.originalUrl,
    "body" : req.body,
    // "ip" : req.ip
  }));
  next();
});

router.post("/status", function(req, res) {
  var key = datastoreClient.key('used_record', Date.now());
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
var entitiesCache = {
  at : 0,
  entities : []
};
router.post("/getManyRecords", function(req, res) {
  urls.forEach(function(url) {
    res.header("Access-Control-Allow-Origin", url);
  });
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var num;
  if (isNaN(parseFloat(req.body.num))) {
    num = 5;
  } else {
    num = +(req.body.num || 5);
  }
  var now = Date.now(), isQuery = false;
  if (now - entitiesCache.at > 1000 * 60) {
    isQuery = true;
  }
  if (entitiesCache.entities.length < num) {
    isQuery = true;
  }
  if (isQuery) {
    console.log("Query Google Datastore");
    // update entities
    var query = datastoreClient.createQuery('used_record')
      .order('created_at', {
        descending : true
      })
      .limit(num)
      ;
    return datastoreClient.runQuery(query, function(err, entities) {
      if (err) {
        errorPrinter(err);
        return res.json({});
      } else {
        entitiesCache.at = Date.now();
        entitiesCache.entities = entities;
        return res.json(entitiesCache.entities.slice(0, num));
      }
    });
  } else {
    return res.json(entitiesCache.entities.slice(0, num));
  }
});

router.post("/getRecordsByUserId", function(req, res) {

  var query1 = datastoreClient.createQuery('used_record')
    .filter('user_id', '=', req.body.user_id)
    ;
  var query2 = datastoreClient.createQuery('used_record_backup')
    .filter('user_id', '=', req.body.user_id)
    ;
  return datastoreClient.runQuery(query1, function(err, entities1) {
    if (err) {
      errorPrinter(err);
      return res.json({});
    } else {
      return datastoreClient.runQuery(query2, function(err, entities2) {
        if (err) {
          errorPrinter(err);
          return res.json({});
        }
        return res.json(entities1.concat(entities2));
      });
    }
  });
});

app.use('/api', router);

// init server
var server = app.listen(process.env.PORT || '3000', function() {
  console.log('App listening on port %s', server.address().port);
});
