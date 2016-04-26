/**
 * Populate DB with subtitle and subtitle parsed data on server start
 * to disable, edit config/environment/index.js, and set `importSubs: false`
 */

'use strict';

var fs = require('fs'),
    Encoding = require('encoding-japanese'),
    AssHelper = require(__dirname +'/import_helpers/ass_helper'),
    SrtHelper = require(__dirname +'/import_helpers/srt_helper'),
    Episode = require('../api/episode/episode.model'),
    ParsedSubtitle = require('../api/subtitles_parsed/subtitles_parsed.model'),
    ParsedToVocab = require(__dirname +'/subsparsed_to_vocab');

var Mecab = require('mecab-lite'),
    mecab = new Mecab();

var parsed;
var targetDir = '/api/anime/imports/first/sword_art_online/subs/';
var allFiles;
var fileIndex = 0;
var parsedIndex = 0;
var wordIndex = 0;
var finalParsedSubs = [];
var filename = '';

var wordList = [];

var SubToSubParsed = {
  init: function(){
    ParsedSubtitle.find({}).remove(function(){
        getFiles();
    });
  }
}

SubToSubParsed.init();

function linkEpisodeRecord(){

    var epNumber = filename.match(/([0-9]{2})/g);
    epNumber = parseInt(epNumber);
    epNumber = epNumber.toString();

    Episode.findOne({"episode" : epNumber}, function(err, episode){
        episode.sub_file_location = targetDir + filename;
        episode.sub_parsed = finalParsedSubs;
        episode.save(function (err, item, numAffected) {
            if (err){
                console.log(err + '\n' + epNumber);
            }else{
                fileIndex+=1;
                getFile()
            }
        });
    });

};

function createSubtitleParsedEntry(){

    var thisTime = parsed[parsedIndex];

    var subtitleParsedEntry = new ParsedSubtitle({
        start_hours: thisTime.start_hours,
        start_minutes: thisTime.start_minutes,
        start_seconds: thisTime.start_seconds,
        end_hours: thisTime.end_hours,
        end_minutes: thisTime.end_minutes,
        end_seconds: thisTime.end_seconds,
        start: thisTime.start,
        end: thisTime.end,
        display_text: thisTime.display_text
        //parsed_words: wordList
    });

    finalParsedSubs.push(subtitleParsedEntry);

    subtitleParsedEntry.save(function (err, item) {
        if (err) console.log(err);
        if(parsed.length > parsedIndex + 1){
            parsedIndex += 1;
            createSubtitleParsedEntry();
        }else{
            linkEpisodeRecord(finalParsedSubs);
        }

    });

};

function getFile(){

    parsedIndex = 0;
    finalParsedSubs = [];

    if(allFiles.length > fileIndex){

        filename = allFiles[fileIndex];

        fs.readFile(__dirname + '/..' + targetDir + filename, 'utf8', function(err, file){
            console.log('Filename: ' + filename);
            if(filename.indexOf('.ass') > -1){
                //console.log('ASS FILE');
                AssHelper.parseSubFile(file, function(entries){
                  parsed = entries;
                  createSubtitleParsedEntry();
                });
            }else if(filename.indexOf('.srt') > -1){
                //console.log('SRT FILE');
                SrtHelper.parseSubFile(file, function(entries){
                  parsed = entries
                  createSubtitleParsedEntry();
                });
            }else{
                parsed = null;
                console.log('NOT A FORMAT I UNDERSTAND');
                fileIndex+=1;
                getFile()
            }
        });
    }else{
        console.log('Done with Subs Entries')
        ParsedToVocab.init();
    }
};

function getFiles(){
    fs.readdir(__dirname + '/..' + targetDir, function(err, files){
        if (err) throw err;
        allFiles = files;
        getFile()
    });
};
