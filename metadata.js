var express = require('express');
var router = express.Router();
var db = require('./datastore.js');  
var config = require('./config.js');

router.get('/', function(req, res){
    db.metadata.find({}, (error, metadata) => {
      if (error)
        return res.status(500).send({error: error});
      if (req.accepts('html'))
        res.render('metadata', { metadata: metadata, cssUrl: config.defaultCssUrl });
      else
        res.send(metadata);      
    });
});

router.get('/new', function(req, res){
  db.metadata.find({}, (error, validations) => {
    if (error){
      res.status(500).send(error);
    }

    res.render('new_metadata', { validations: validations});
  });
});

router.post('/', function(req, res){
  var data = req.body;
  var config = JSON.parse(data.config);
  data.config = config;
  data.createdAt = new Date();

  db.metadata.insert(data, (error, newMetadata) => {
    if (!error)
      res.json(newMetadata);
    else
      res.status(500).send({error: error});
  });
});

router.delete('/:metadataId', function(req, res){
  db.metadata.remove({_id: req.params.metadataId}, (error, removed)=>{
    if (error)
      res.status(500).send(error);
    else
      res.sendStatus(204);
  });
});

router.get('/:metadataId', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, metadata) => {
    if (metadataError)
      return res.status(404).send(metadataError);
      
    var captureUrl = config.captureUrl; 
    if (req.query.preview == 'yes')
      captureUrl = '#';
    
    if (req.accepts('html')) {
       res.render('edit_metadata', {
          metadata: metadata,
        });
    }
    else {
      res.send(metadata);
    }
  });
});

router.put('/:metadataId', function(req, res){
  var data = req.body;
  var config = JSON.parse(data.config);
  data.config = config;
  data.updatedAt = new Date();
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, metadata) => {
      if (metadataError)
        return res.status(404).send(metadataError);

    db.metadata.update({_id: req.params.metadataId}, data, {}, (error) => {
      if (!error)
        res.status(200).send();
      else
        res.status(500).send({error: error});
    });
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/:metadataId/ui', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, metadata) => {
    if (metadataError)
      return res.status(404).send(metadataError);
    if (metadata.config.metadata_ui === undefined)
      return res.status(500).send({ error : "Metadata UI not found, check configuration." });
    
    db.metadataUI.findOne({_id: metadata.config.metadata_ui}, (metadataError, metadataUi) => {
      if (metadataError) {
        return res.status(404).send(metadataError);
      }
      renderForm(req, res, metadataUi, metadata);

    });
  });
});

var renderForm = function(req, res, metadataUi, metadata) {
  if (req.accepts('html')) {
    var captureUrl = config.captureUrl;
    if (req.query.preview == 'yes')
      captureUrl = '#';
    var cssUrl = req.query.cssUrl || config.defaultCssUrl;
    res.render('form', {
      metadataUi: metadataUi,
      metadata: metadata,
      postUrl: captureUrl,
      cssUrl: cssUrl
    });
  } else {
    res.send(metadataUi);
  }
};

module.exports = router;