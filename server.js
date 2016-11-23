var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid');
var moment = require('moment');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.moment = moment;

// Temporary storage in memory
var _containers = [];
var _sensitiveData = [];
var _metadata = [];

app.get('/', function (req, res) {
  res.render('index', { title: 'Dynamic Ui'});
});

/*
 * Metadata
 */
app.get('/metadata', function(req, res){
  if (req.accepts('html'))
     res.render('metadata', {metadata: _metadata});
  else
    res.send(_metadata);
});

app.get('/metadata/new', function(req, res){
  var validations = ['Required', 'Numeric', 'AlphaNumeric']; // TODO: get this from validations api
  res.render('new_metadata', { validations: validations});
});

app.post('/metadata', function(req, res){
  var data = req.body;
  data.id = uuid.v4();
  data.createdAt = new Date();
  _metadata.push(data);
  res.sendStatus(201);
});

app.post('/container', function(req, res){
  var containerId = uuid.v4();
  _containers.push({
    id: containerId,
    fields: req.body.fields
  });

  res.json({ containerId: containerId });
});

app.get('/container/:id', function(req, res){
  var found = _containers.find(function(c){
    return c.id == req.params.id;
  });

  if (found)
    res.render('container', found);
  else
    res.sendStatus(404);
});

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
