var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');

// GPT Modules
var metadata = require('./metadata.js');
var validation = require('./validation.js');
var data = require('./data.js');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.moment = moment;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/metadata', metadata);
app.use('/validation', validation);
app.use('/data', data);

app.get('/', function (req, res) {
  res.redirect('/metadata');
});

var port = 3000;
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
