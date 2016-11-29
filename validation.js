var express = require('express');
var router = express.Router();
var db = require('./datastore.js');

/**
 * Get All
 */
router.get('/', (req, res) => {

  db.validation.find({}, (error, validations)=>{
    if (error)
      return res.status(500).send(error);

    if (req.accepts('html'))
      res.render('validation', {validations: validations});
    else
      res.json(validations);
  });

});

/**
 * Create
 */
router.get('/new', (req, res)=>{
    res.render('new_validation');
});

/**
 * Insert
 */
router.post('/', (req, res)=>{
 var data = req.body;
  data.createdAt = new Date();

  db.validation.insert(data, (error, newValidation) => {
    if (!error)
      res.json(newValidation);
    else
      res.status(500).send({error: error});
  });
});

/**
 * Delete
 */
router.delete('/:validationId', function(req, res){
  db.validation.remove({_id: req.params.validationId}, (error, removed)=>{
    if (error)
      res.status(500).send(error);
    else
      res.sendStatus(204);
  });
});

/**
 * Get One
 */
router.get('/:validationId', (req, res) => {

});

module.exports = router;