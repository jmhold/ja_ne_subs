'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;;

var ParsedWordSchema = new Schema({
    active: Boolean,
    text: String,
    pos_main: String,
    pos_sub: String,
    vobab_link: {
      type: ObjectId,
      ref: 'Vocab'
    }
});

module.exports = mongoose.model('ParsedWord', ParsedWordSchema);