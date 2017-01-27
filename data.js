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

router.post('/', (req, res) => {
  var data  = req.body;
  console.log(data);
  db.metadata.findOne({_id: data.content.metadata_id}, (error, metadata) => {
    if (error)
      return res.status(500).send(error);
    console.log(metadata);
    loadValidationList((validations) => {
      db.metadataUI.findOne({_id: metadata.config['metadata-ui']}, (error, metadataUI) => {
        if (error)
          return res.status(404).send(error);
        var result = { success: true };
        var error = false;

        var ok = metadataUI.fields.every((f) => {
          if (f.validations === undefined) {
            return true;
          }
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
});

router.get('/:token', function(req, res){
  db.data.findOne({ _id: req.params.token}, (error, found) => {
  if (found)
    res.json(found);
  else
    res.sendStatus(404);
  });
});

module.exports = router;
