'use strict';

var _ = require('lodash');
var TimecodeToVocab = require('./timecodeToVocab.model');

var mongoose = require('mongoose'),
    Episode = require('../episode/episode.model'),
    ParsedSubtitle = require('../subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../parsed_word/parsed_word.model'),
    Vocab = require('../vocab/vocab.model');

var returnObj = {};


exports.index = function(req, res) {
  //console.log(req.query);
  var epID = parseInt(req.query.epID)
  var timecode = parseInt(req.query.timecode)
  Episode.findOne({episode:epID})
  .populate(
  {
    path: 'sub_parsed',
    match: {
      start: { $lte: timecode },
      end: { $gte: timecode }
    }
  })
  .exec(function(err, ep){
    ParsedSubtitle.find(
      {
        parsed_words: {
          $in: ep.sub_parsed[0].parsed_words.map(
            function(o){
              return mongoose.Types.ObjectId(o);
            }
          )
        }
      }
    )
    .populate({
      path: 'parsed_words'
    })
    .exec(function(err, words){
      //console.log(words)
      returnVocab(res, words[0].parsed_words)
      // return res.status(200).json(words);
    })
  })
};

function returnVocab(res, words){

  var returnArray = []
  for(var i in words){
    if(words[i].vocab_link && words[i].vocab_link.length > 0){
      returnArray.push(words[i])
    }
  }
  return res.status(200).json(returnArray);
}

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
