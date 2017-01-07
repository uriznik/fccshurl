var express = require('express');
var router = express.Router();

/* redirect to expanded URL */
router.get('/:url', function(req, res, next) {
  var db = req.app.get('mongoDB');

  console.log(req.params.url);
});

module.exports = router;
