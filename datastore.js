var datastore = require('nedb')

var db = {
  metadata: new datastore({
    filename: __dirname + '/db/metadata.db',
    autoload: true
  }),

  validation: new datastore({
    filename: __dirname + '/db/validation.db',
    autoload: true
  }),

  data: new datastore({
    filename: __dirname + '/db/data.db',
    autoload: true
  })
};

module.exports = db;