'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var SubtitleSchema = new Schema({
    active: Boolean,
    file_location: String,
    parsed:{
        type: ObjectId,
        ref: 'ParsedSubtitle'
    }
});

module.exports = mongoose.model('Subtitle', SubtitleSchema);