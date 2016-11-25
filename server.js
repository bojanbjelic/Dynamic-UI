var config = require('./config.js');
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

db.data = new datastore({
   filename: __dirname + '/db/data.db',
   autoload: true
});

app.get('/', function (req, res) {
  res.render('index');
});


/*
 * Metadata
 */
app.get('/metadata', function(req, res){
    db.metadata.find({}, (error, metadata) => {
      if (error)
        return res.status(500).send({error: error});
      console.log(config.defaultCssUrl);
      if (req.accepts('html'))
        res.render('metadata', { metadata: metadata, cssUrl: config.defaultCssUrl });
      else
        res.send(metadata);
      
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

app.get('/metadata/:metadataId', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, foundMetadata)=>{
    if (metadataError)
      return res.status(404).send(metadataError);
  
    console.log(req.query);
    if (req.accepts('html')){
      var cssUrl = req.query.cssUrl || config.defaultCssUrl;
      res.render('form', {
        metadata: foundMetadata,
        postUrl: config.captureUrl,
        cssUrl: cssUrl
      });
    } else {
      res.send(foundMetadata);
    }
  });
});

/*
 * Form
 */
app.get('/form/:id', function(req, res){
  db.metadata.findOne({_id: req.params.id}, (error, found)=>{
    if (found)
      res.render('form', {
        metadata: found,
        cssUrl: "/css/sample.css",
      });
    else
      res.status(404).send(error);
  });
});

app.get('/form/preview/:metadataId/:cssUrl', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, metadata) => {
    if (metadata){
      res.render('form', {
        metadata: metadata, 
        cssUrl: req.params.cssUrl,
        postUrl: "#"
      });
    } else {
      res.status(404).send("Metadata not found: " + container.metadata._id);
    }
  });
});

app.get('/form/c/:id', function(req, res){
  db.container.findOne({_id: req.params.id}, (containerError, container) => {
    if (container){      
      db.metadata.findOne({_id: container.metadata._id}, (metadataError, metadata) => {
        if (metadata){
          res.render('form', {
            metadata: metadata, 
            cssUrl: container.cssUrl
          });
        } else {
          res.status(404).send("Metadata not found: " + container.metadata._id);
        }
      });
    } else {
      res.status(404).send("Container not found: " + req.params.id);
    }
  });
});

/*
 * Container
 */
app.get('/container', function(req, res){
    db.container.find({}, (error, containers)=>{
      if (!error){
        if (req.accepts('html'))
          res.render('container_list', {containers: containers});
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

app.get('/container/:containerId/:metadataId', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, foundMetadata)=>{
    if (metadataError)
      return res.status(404).send(metadataError);

    db.container.find({_id: req.params.containerId}, (containerError, foundContainer) =>{
      if (containerError)
        return res.status(404).send(containerError);
      
        res.render('container', {
          metadata: foundMetadata,
          postUrl: config.capturingEndpoint,
          cssUrl: foundContainer.cssUrl
        });

    });
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
  db.data.insert(req.body, (error, newData) => {

  })
  res.json({ token: newData._id });
});

app.get('/data/:token', function(req, res){
  db.data.findOne({ _id: req.params.token}, (error, found) => {
    if (found)
    res.json(found);
  else
    res.sendStatus(404);
  });
});

var port = 3000;
app.listen(port, ()=>{  
  console.log('Server listening on port ' + port);
});
