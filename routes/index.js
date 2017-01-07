var express = require('express');
var router  = express.Router();
var shorten = require('../shorten');

router.get('/:key', function(req, res, next) {
  if (req.baseUrl !== '') {
    return next();
  }
  var db = req.app.get('mongoDB');

  var key = req.params.key;

  shorten.fetch(db, key,
    function(url) {
      if (url) {
        res.status(302);
        res.location(url.url);
        res.end();
      } else {
	res.status(400);
	res.end();
      }
    });
});

router.get('/', function(req, res, next) {
  var db = req.app.get('mongoDB');

  res.render('index', {
    title: 'URL Shortener'
  });
});

module.exports = router;
