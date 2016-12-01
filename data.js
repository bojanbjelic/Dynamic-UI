var express = require('express');
var router = express.Router();
var db  = require('./datastore.js');

function loadValidationList(callback){
  db.validation.find({}, (validationError, list) => {
    var loaded = {};
    list.forEach((v) => {
      loaded[v.name] = require(v.moduleName);
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
    db.metadata.find({_id: data.metadata_id}, (metadataError, foundMetadata) => {
      if (metadataError)
        return res.status(500).send(metadataError); 

      
      for(var i = 0; i < foundMetadata.fields; i++){
        data[fo]
      }


    });
  });

  db.metadata.find({_id: req.body.metadata_id}, (metadataError, foundMetadata) => {
    if (metadataError)
      return res.status(500).send(metadataError);

    var validations = foundMetadata.fields.reduce((validationList, metadata)  => {
      metadata.forEac()
    }, []);
  });

  db.data.insert(req.body, (error, newData) => {
    if (error)
      return res.status(500).error;

    res.json({ token: newData._id });
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