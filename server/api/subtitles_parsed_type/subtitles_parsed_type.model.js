//Used to describe the type of subtitle entry ie Music Entry, Spoken Entry etc

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubtitlesParsedTypeSchema = new Schema({
  name: String
});

module.exports = mongoose.model('SubtitlesParsedType', SubtitlesParsedTypeSchema);