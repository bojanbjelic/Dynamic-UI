var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');

// GPT Modules
var metadata = require('./metadata.js');
var validation = require('./validation.js');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.moment = moment;

app.use('/metadata', metadata);
app.use('/validation', validation);

app.get('/', function (req, res) {
  res.redirect('/metadata');
});

/*
 * Data
 */
app.post('/data', function(req, res){
  db.data.insert(req.body, (error, newData) => {
    if (error)
      return res.status(500).error;

    res.json({ token: newData._id });
  });  
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
