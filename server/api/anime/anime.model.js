'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var AnimeSchema = new Schema({
    active: Boolean,
    title: String,
    episode_count: Number,
    start_date: String,
    end_date: String,
    desc: String,
    episodes: [
        {
            type: ObjectId,
            ref: 'Episode'
        }
    ]
});

module.exports = mongoose.model('Anime', AnimeSchema);