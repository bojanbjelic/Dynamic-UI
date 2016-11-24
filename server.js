var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');
var moment = require('moment');
var datastore = require('nedb')

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.moment = moment;

var db = {};
db.container = new datastore({
   filename: __dirname + '/db/container.db',
   autoload: true
});
db.metadata = new datastore({
   filename: __dirname + '/db/metadata.db',
   autoload: true
});

console.log('db at ' + __dirname);

// Temporary storage in memory
var _containers = [];
var _sensitiveData = [];
var _metadata = [];

app.get('/', function (req, res) {
  res.render('index');
});

/*
 * Metadata
 */
app.get('/metadata', function(req, res){
    db.metadata.find({}, (error, metadata)=>{
      if (!error){
        if (req.accepts('html'))
          res.render('metadata', {metadata: metadata});
        else
          res.send(metadata);
      }else{
        res.status(500).send({error: error});
      }
    });
});

app.get('/metadata/new', function(req, res){
  var validations = ['Required', 'Numeric', 'AlphaNumeric']; // TODO: get this from validations api
  res.render('new_metadata', { validations: validations});
});

app.post('/metadata', function(req, res){
  var data = req.body;
  data.createdAt = new Date();

  db.metadata.insert(data, (error, newMetadata) => {
    if (!error)
      res.json(newMetadata);
    else
      res.status(500).send({error: error});
  });
});

/*
 * Form
 */
app.get('/form/:id', function(req, res){
  db.metadata.findOne({_id: req.params.id}, (error, found)=>{
    if (found)
      res.render('form', {metadata: found});
    else
      res.sendStatus(404);
  });
});

/*
 * Container
 */
app.get('/container', function(req, res){
    db.container.find({}, (error, containers)=>{
      if (!error){
        if (req.accepts('html'))
          res.render('container', {containers: containers});
        else
          res.send(containers);
      }else{
        res.status(500).send({error: error});
      }
    });
});

app.post('/container', function(req, res){
  var data = req.body;
  data.createdAt = new Date();
  
  db.container.insert(data, (error, newContainer) => {
    if (!error)
      res.json(newContainer);
    else
      res.status(500).send({error: error});
  });
});

app.get('/container/new', function(req, res){
  db.metadata.find({}, (error, list)=>{
    res.render('new_container', { metadata: list});
  });
});

/*
 * Data
 */

app.post('/data', function(req, res){
  var token = uuid.v4();
  _sensitiveData.push({
    token: token,
    data: req.body
  });

  res.json({ token: token });
});

app.get('/data/:token', function(req, res){
  var found = _sensitiveData.find(function(d){
    return d.token == req.params.token;
  });

  if (found)
    res.json(found);
  else
    res.sendStatus(404);
});

var port = 3000;
app.listen(port, ()=>{  
  console.log('Server listening on port ' + port);
});
