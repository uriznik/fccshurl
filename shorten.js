const assert      = require('assert');

const crypto     = require('crypto');
const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

const shorten = {
  fetch: function(db, key, callback) {
    // Get the documents collection
    var collection = db.collection('shorten');
    collection.findOne({
      'key': key
    }, function(err, url) {
      assert.equal(err, null);
      return callback(url);
    });
  },

  hash: function(data) {
    var hash = crypto.createHash('sha256').update(data).digest();

    // Extract 6 bits from first 10 hash bytes and use
    // those to get 10 characters from the dictionary
    var key = Array.from(hash.slice(0, 10))
      .map(c => dictionary[c & 63])
      .join('');

    return key;
  }
}

module.exports = shorten;
