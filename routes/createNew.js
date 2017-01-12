var express  = require('express');
var router   = express.Router();
var shorten  = require('../shorten');
var assert   = require('assert');
var validUrl = require('valid-url');

/* Handle form POST request at /shorten */

function insertURL(db, url, callback) {
  /* TODO: Handle collisions in the hash with existing key + URL */
  var key = shorten.hash(url);

  var collection = db.collection('shorten');

  /* Add key and URL if it doesn't already exist */
  collection.findAndModify(
    {
      'key': key
    },
    [],
    {
      $setOnInsert: {
        'key': key,
        'url': url
      }
    },
    {
      new:    true,
      upsert: true
    }
    , function(err, result) {
      assert.equal(err, null);
      callback(err, result);
    });
}

router.get('/*', function(req, res, next) {
  var db  = req.app.get('mongoDB');
  var url = req.params[0];

  if (url && validUrl.isWebUri(url)) {
    /* TODO: Handle errors */
    insertURL(db, url, function(err, result) {
      var key = result.value.key;
      res.send({
        orignal_url:   url,
        shortened_url: req.protocol + '://' + req.app.get('hostport') + '/' + key
      });
    });;
  } else {
    res.status(400).send({
      error: 'Invalid URL'
    })
  }
});

module.exports = router;
