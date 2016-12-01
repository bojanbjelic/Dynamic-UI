var express = require('express');
var router = express.Router();
var db = require('./datastore.js');  
var config = require('./config.js');

/*
 * Get All
 */
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

/*
 * Create Form
 */
router.get('/new', function(req, res){

  db.validation.find({}, (error, validations) => {
    if (error){
      res.status(500).send(error);
    }

    res.render('new_metadata', { validations: validations});
  });
});

/*
 * Insert
 */
router.post('/', function(req, res){
  var data = req.body;
  data.createdAt = new Date();

  db.metadata.insert(data, (error, newMetadata) => {
    if (!error)
      res.json(newMetadata);
    else
      res.status(500).send({error: error});
  });
});

/**
 * Delete
 */
router.delete('/:metadataId', function(req, res){
  db.metadata.remove({_id: req.params.metadataId}, (error, removed)=>{
    if (error)
      res.status(500).send(error);
    else
      res.sendStatus(204);
  });
});

/*
 * Get One
 */
router.get('/:metadataId', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, foundMetadata) => {
    if (metadataError)
      return res.status(404).send(metadataError);
      
    var captureUrl = config.captureUrl; 
    if (req.query.preview == 'yes')
      captureUrl = '#';

    if (req.accepts('html')){
      var cssUrl = req.query.cssUrl || config.defaultCssUrl;
      res.render('form', {
        metadata: foundMetadata,
        postUrl: captureUrl,
        cssUrl: cssUrl
      });
    } else {
      res.send(foundMetadata);
    }
  });
});

module.exports = router;