'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var ParsedSubtitleSchema = new Schema({
    start_hours: Number,
    start_minutes: Number,
    start_seconds: Number,
    end_hours: Number,
    end_minutes: Number,
    end_seconds: Number,
    start: Number,
    end: Number,
    display_text: String,
    parsed_words:[
        {
            type: ObjectId,
            ref: 'ParsedWord'
        }
    ]
});

module.exports = mongoose.model('ParsedSubtitle', ParsedSubtitleSchema);