'use strict';

var _ = require('lodash');
var TimecodeToVocab = require('./timecodeToVocab.model');

var Episode = require('../episode/episode.model'),
    ParsedSubtitle = require('../subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../parsed_word/parsed_word.model'),
    Vocab = require('../vocab/vocab.model');


exports.index = function(req, res) {
  Episode.find(function (err, episode) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(episode);
  });
};


// Get timecode in miliseconds to vocab for a specific episode
exports.show = function(req, res) {

  var returnObj = {};

  Episode.findById(req.params.id, function(err, episode){
    if(err) { console.log(err); }
    if(!episode) { return res.status(404).send('Episode Not Found'); }

    returnObj.title = episode.title;

    for(var i in episode.sub_parsed){

      ParsedSubtitle.findById(episode.sub_parsed[i], function(err, parsed){
        if(err) { console.log(err); }
        if(!parsed) { return res.status(404).send(episode.sub_parsed[i] + ' Parsed Subtitle Not Found'); }

        console.log('Episode' + parsed.display_text)

        if(!returnObj.parsed){
          returnObj.parsed = [];
        }

        var thisParsed = {
          start: parsed.start,
          end: parsed.end,
          words: []
        };

        returnObj.parsed.push(thisParsed);

        for(var j in parsed.parsed_words){
          thisParsed.words.push(
            ParsedWord.findById(parsed.parsed_words[j], function(err, word){
              if(err) { console.log(err); }
              if(!word) { return res.status(404).send(parsed.parsed_words[j] + ' Parsed Word Not Found'); }
              return word.text;
            })
          )
        }

      })

    }

  });


  return res.status(200).json(returnObj);


  //TimecodeToVocab.findById(req.params.id, function (err, timecodeToVocab) {
  //  if(err) { return handleError(res, err); }
  //  if(!timecodeToVocab) { return res.status(404).send('Not Found'); }
  //  return res.json(timecodeToVocab);
  //});



};

function handleError(res, err) {
  return res.status(500).send(err);
}