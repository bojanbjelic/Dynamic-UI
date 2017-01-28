var express = require('express');
var router = express.Router();
var db  = require('./datastore.js');

router.post('/', (req, res) => {
  var data  = req.body;
  //console.log(req);
  //console.log(data);
  var body = [];
  req.on('error', function(err) {
    res.statusCode = 500;
    res.write(JSON.stringify({ "description" : "body can't be read." }));
    res.end();
    return;
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {

    body = Buffer.concat(body).toString();
    try {
      var pt = JSON.parse(body);
    } catch(exc) {
      res.statusCode = 500;
      res.write(JSON.stringify({ "description" : "body doesn't contain properly formatted JSON." }));
      res.end();
      return;
    }
    console.log(pt);
  });
  
});

router.get('/:token', function(req, res){
  db.data.findOne({ _id: req.params.token}, (error, found) => {
  if (found)
    res.json(found);
  else
    res.sendStatus(404);
  });
});

function loadValidationList(callback){
  db.validation.find({}, (validationError, list) => {
    var loaded = {};
    list.forEach((v) => {
      loaded[v.name] = require(v.module);
    });

    callback(loaded);
  });
}

var validate = function(data, metadataUI, validations) {
  metadataUI.fields.every((f) => {
    if (f.validations === undefined) {
      return null;
    }
    return f.validations.every((v) => {
      var validator = validations[v.name]
      if (validator.validate(data[f.name]))
        return null;

      var error = {
        field: { name: f.name },
        errorMessage: validator.getError()
      };

      return error;
    });
  });
};

module.exports = router;
