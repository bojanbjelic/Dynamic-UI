var config = require('./config.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');
var moment = require('moment');
var db = require('./datastore.js')

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.moment = moment;

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
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, foundMetadata) => {
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

app.get('/validation', (req, res) => {
  m

  if (req.accepts('html'))
    res.render('validation-list')
});

/*
 * Data
 */
app.post('/data', function(req, res){
  db.data.insert(req.body, (error, newData) => {
    if (error)
      return res.status(500).error;

    res.json({ token: newData._id });
  })
  
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
app.listen(port, () => {  
  console.log('Server listening on port ' + port);
});
