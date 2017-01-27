var express = require('express');
var router = express.Router();
var db = require('./datastore.js');  
var config = require('./config.js');

router.get('/', function(req, res){
    db.metadataUI.find({}, (error, metadata) => {
      if (error)
        return res.status(500).send({error: error});

      if (req.accepts('html'))
        res.render('metadata-ui', { metadata: metadata, cssUrl: config.defaultCssUrl });
      else
        res.send(metadata);      
    });
});

router.get('/new', function(req, res){
  db.validation.find({}, (error, validations) => {
    if (error){
      res.status(500).send(error);
    }

    res.render('new_metadata-ui', { validations: validations});
  });
});

router.post('/', function(req, res){
  var data = req.body;
  data.createdAt = new Date();
  db.metadataUI.insert(data, (error, newMetadata) => {
    if (!error)
      res.json(newMetadata);
    else
      res.status(500).send({error: error});
  });
});

router.get('/:metadataUiId/:metadataId', function(req, res) {
  
  db.metadataUI.findOne({_id: req.params.metadataUiId}, (metadataError, metadataUi) => {
    if (metadataError) {
      return res.status(404).send(metadataError);
    }
    
    if (req.params.metadataId !== undefined) {
      db.metadata.findOne({_id: req.params.metadataId}, (metadataError, metadata) => {
        renderForm(req, res, metadataUi, metadata);
      });
    } 
    else {
      renderForm(req, res, metadataUi);
    }
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
  
router.delete('/:metadataId', function(req, res){
  db.metadataUI.remove({_id: req.params.metadataId}, (error, removed)=>{
    if (error)
      res.status(500).send(error);
    else
      res.sendStatus(204);
  });
});

module.exports = router;