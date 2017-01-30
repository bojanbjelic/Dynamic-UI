var express = require('express');
var router = express.Router();
var db  = require('./datastore.js');

router.post('/', (req, res) => {
  var data  = req.body;
  console.log(data);
  
  db.metadata.findOne({method: data.method}, (error, metadata) => {
    if (error)
      return res.status(500).send(error);
    
    loadValidationList((validations) => {
      
      db.metadataUI.findOne({_id: metadata.config.metadata_ui}, (error, metadataUI) => {
        if (error)
          return res.status(500).send(error);
        
        // HACK, validate will return NULL
        // TODO scheme validation
        // TODO calculate display value
        var error = validate(data, metadataUI, validations); 
        if (error != null) {
          return res.status(400).send({
            success: false,
            error: error
          });
        }
        
        if (data.created === undefined)
          data.created = new Date();
        
        if (data.version === undefined)
          data.version = 1;
        
        db.data.insert(data, (insertError, newData) => {
          if (insertError)
            return res.status(500).send(insertError);

          res.json({ success: true, token: newData._id });
        });
      });
    });
  });
  
});

router.get('/:token', function(req, res) {
  console.log("hit");
  db.data.findOne({ _id: req.params.token}, (error, found) => {
    console.log(found);
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
  return null;
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
