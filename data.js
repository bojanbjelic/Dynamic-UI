var express = require('express');
var router = express.Router();
var db  = require('./datastore.js');

function loadValidationList(callback){
  db.validation.find({}, (validationError, list) => {
    var loaded = {};
    list.forEach((v) => {
      loaded[v.name] = require(v.module);
    });

    callback(loaded);
  });
}

/**
 * Insert
 */
router.post('/', (req, res) => {
  var data  = req.body;
  loadValidationList((validations) => {
    db.metadata.findOne({_id: data.metadata_id}, (metadataError, foundMetadata) => {
      if (metadataError)
        return res.status(404).send(metadataError);

      var result = { success: true };
      var error = false;
      var ok = foundMetadata.fields.every((f) => {
        return f.validations.every((v) => {
          var validator = validations[v.name]
          if (validator.validate(data[f.name]))
            return true;

          error = {
            field: { name: f.name },
            errorMessage: validator.getError()
          };

          return false;
        });
      });

      if (!ok)
      {
        return res.status(400).send({
          success: false,
          error: error
        });
      }

      db.data.insert(req.body, (insertError, newData) => {
        if (insertError)
          return res.status(500).send(insertError);

        res.json({ success: true, token: newData._id });
      });

    });
  });




});

/**
 * Get
 */
router.get('/:token', function(req, res){
  db.data.findOne({ _id: req.params.token}, (error, found) => {
  if (found)
    res.json(found);
  else
    res.sendStatus(404);
  });
});

module.exports = router;
