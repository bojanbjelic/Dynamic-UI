var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Dynamic Ui'});
});

var _containers = [];

app.post('/container', function(req, res){
  var containerId = _containers.length + 1;
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
