'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransliterationsSchema = new Schema({
    type: String,
    text: String
});

var TranslationsSchema = new Schema({
    language: String,
    text: String
});

//var SentencesSchema = new Schema({
//    language: String,
//    text: String,
//    sound: String,
//    translations: [TranslationsSchema],
//    transliterations: [TransliterationsSchema]
//});

var VocabSchema = new Schema({
    active: Boolean,
    language:String,
    part_of_speech: String,
    text: String,
    sound: String,
    translations: [TranslationsSchema],
    transliterations: [TransliterationsSchema],
});

module.exports = mongoose.model('Vocab', VocabSchema);