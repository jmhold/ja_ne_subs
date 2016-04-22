'use strict';

var mongoose = require('mongoose'),
    deepPopulate = require('mongoose-deep-populate')(mongoose),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var EpisodeSchema = new Schema({
    active: Boolean,
    episode: String,
    title: String,
    air_date: String,
    sub_file_location: String,
    sub_parsed: [
        {
            type: ObjectId,
            ref: 'ParsedSubtitle'
        }
    ]
});

module.exports = mongoose.model('Episode', EpisodeSchema);
