'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimecodeToVocabSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('TimecodeToVocab', TimecodeToVocabSchema);