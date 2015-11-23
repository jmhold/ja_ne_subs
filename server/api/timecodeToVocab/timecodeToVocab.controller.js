'use strict';

var _ = require('lodash');
var TimecodeToVocab = require('./timecodeToVocab.model');

var Episode = require('../episode/episode.model'),
    ParsedSubtitle = require('../subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../parsed_word/parsed_word.model'),
    Vocab = require('../vocab/vocab.model');

var returnObj = {};


exports.index = function(req, res) {
  Episode.find(function (err, episode) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(episode);
  });
};


// Get timecode in miliseconds to vocab for a specific episode
exports.show = function(req, res) {

  Episode
      .findOne({episode:req.params.id})
      .populate('sub_parsed')
      .exec(function(err, episode){
        if(err) return res.status(500).send(err);
        if(!episode) return res.status(404).send('Episode Not Found');

        ParsedSubtitle.populate(episode.sub_parsed, {path:'parsed_words'}, function(err, data){
          if(err) return res.status(500).send(err);
          ParsedWord.populate(data, {path:'vocab_link'}, function(err, data2){
            if(err) return res.status(500).send(err);
            //console.log(data2)
            episode.sub_parsed = data2;
            return res.status(200).json(episode);
          })
        });
      });
};

function handleError(res, err) {
  return res.status(500).send(err);
}