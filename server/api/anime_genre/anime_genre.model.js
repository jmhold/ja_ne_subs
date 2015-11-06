'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnimeGenreSchema = new Schema({
  name: String
});

module.exports = mongoose.model('AnimeGenre', AnimeGenreSchema);