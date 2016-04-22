'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId,
    Vocab = require('../vocab/vocab.model');

//console.log(Vocab.schema)

var ParsedWordSchema = new Schema({
    active: Boolean,
    text: String,
    pos_main: String,
    pos_sub: String,
    vocab_link: [Vocab.schema]
});

module.exports = mongoose.model('ParsedWord', ParsedWordSchema);
