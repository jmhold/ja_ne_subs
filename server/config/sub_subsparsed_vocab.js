/**
 * Populate DB with subtitle and subtitle parsed data on server start
 * to disable, edit config/environment/index.js, and set `importSubs: false`
 */

'use strict';

var fs = require('fs'),
    Encoding = require('encoding-japanese'),
    AssHelper = require(__dirname +'/import_helpers/ass_helper'),
    SrtHelper = require(__dirname +'/import_helpers/srt_helper'),
    MecabHelper = require(__dirname +'/import_helpers/mecab_helper'),
    Vocab = require('../api/vocab/vocab.model'),
    Episode = require('../api/episode/episode.model'),
    ParsedSubtitle = require('../api/subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../api/parsed_word/parsed_word.model');

var Mecab = require('mecab-lite'),
    mecab = new Mecab();

var parsed;
var targetDir = '/api/anime/imports/first/fairy_tail/subs/';
var allFiles;
var fileIndex = 0;
var parsedIndex = 0;
var wordIndex = 0;
var finalParsedSubs = [];
var filename = '';

var wordList = [];


ParsedSubtitle.find({}).remove();
ParsedWord.find({}).remove();

var linkEpisodeRecord = function(){

    var epNumber = filename.match(/([0-9]{3})/g);
    epNumber = parseInt(epNumber);
    epNumber = epNumber.toString();

    Episode.findOne({"episode" : epNumber}, function(err, episode){
        episode.sub_file_location = targetDir + filename;
        episode.sub_parsed = finalParsedSubs;
        episode.save(function (err, item, numAffected) {
            if (err){
                console.log(err + '\n' + epNumber);
            }else{
                //console.log('Saved Item ' + item)
                fileIndex+=1;
                getFile()
            }
        });
    });

};

var createSubtitleParsedEntry = function(){

    var thisTime = parsed[parsedIndex];

    //console.log(wordList.length)

    var subtitleParsedEntry = new ParsedSubtitle({
        start_hours: thisTime.start_hours,
        start_minutes: thisTime.start_minutes,
        start_seconds: thisTime.start_seconds,
        end_hours: thisTime.end_hours,
        end_minutes: thisTime.end_minutes,
        end_seconds: thisTime.end_seconds,
        start: thisTime.start,
        end: thisTime.end,
        display_text: thisTime.display_text,
        parsed_words: wordList
    });

    finalParsedSubs.push(subtitleParsedEntry);

    subtitleParsedEntry.save(function (err, item) {
        if (err) console.log(err);
        if(parsed.length > parsedIndex + 1){
            wordList = [];
            parsedIndex += 1;
            parseWordEntry();
        }else{
            linkEpisodeRecord(finalParsedSubs);
        }

    });

};

var parseWordEntry = function(){

    var thisTime = parsed[parsedIndex];
    if(thisTime != undefined) {

        if (thisTime.display_text != undefined && wordList.length == 0) {
            //console.log(thisTime.display_text)

            wordList = MecabHelper.getWordEntries(thisTime.display_text);

            //console.log(wordList.length)

        }
        if (wordList.length > wordIndex + 1) {
            //console.log('Index: ' + wordIndex)
            //console.log('Length: ' + wordList.length)
            createWordEntry(wordList[wordIndex]);
        } else {
            wordIndex = 0;
            createSubtitleParsedEntry();
        }
    }

};

var createWordEntry = function(word){
    ParsedWord.findOne({text: word.text}, function (err, item) {
        //console.log(item)
        if (item) {
            word = item;
            wordIndex += 1;
            parseWordEntry();
        } else {

            word.save(function (err, item) {
                if (err) console.log(err);
                wordIndex += 1;
                parseWordEntry();
            });
        }
    });
};

var getFile = function(){

    parsedIndex = 0;
    finalParsedSubs = [];

    if(allFiles.length > fileIndex){

        filename = allFiles[fileIndex];

        fs.readFile(__dirname + '/..' + targetDir + filename, 'utf8', function(err, file){
            console.log('Filename: ' + filename);
            if(filename.indexOf('.ass') > -1){
                console.log('ASS FILE');
                parsed = AssHelper.parseSubFile(file);
            }else if(filename.indexOf('.srt') > -1){
                console.log('SRT FILE');
                parsed = SrtHelper.parseSubFile(file);
            }else{
                parsed = null;
                console.log('NOT A FORMAT I UNDERSTAND');
                fileIndex+=1;
                getFile()
            }

            var interval = setInterval(function(){
                if(parsed != undefined){
                    clearInterval(interval);
                    parseWordEntry();
                }else{
                    parsed = AssHelper.parseSubFile(file);
                }
            },1000);
        });
    }else{
        console.log('Done with Subs and Word Entries')
    }
};

var getFiles = function(){
    console.log('getFiles');
    fs.readdir(__dirname + '/..' + targetDir, function(err, files){
        if (err) throw err;
        allFiles = files;
        getFile()
    });
};

getFiles();
