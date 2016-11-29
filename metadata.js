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
      console.log(config.defaultCssUrl);
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
  var validations = ['Required', 'Numeric', 'AlphaNumeric']; // TODO: get this from validations api
  res.render('new_metadata', { validations: validations});
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

/*
 * Get One
 */
router.get('/:metadataId', function(req, res){
  db.metadata.findOne({_id: req.params.metadataId}, (metadataError, foundMetadata) => {
    if (metadataError)
      return res.status(404).send(metadataError);
  
    if (req.accepts('html')){
      var cssUrl = req.query.cssUrl || config.defaultCssUrl;
      res.render('form', {
        metadata: foundMetadata,
        postUrl: config.captureUrl,
        cssUrl: cssUrl
      });
    } else {
      res.send(foundMetadata);
    }
  });
});

module.exports = router;