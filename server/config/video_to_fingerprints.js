/**
 * Populate DB with audio fingerprint references on server start
 * to disable, edit config/environment/index.js, and set `importFingerprints: false`
 */

'use strict';

var fs = require('fs'),
    FfmpegCommand = require('fluent-ffmpeg'),
    Anime = require('../api/anime/anime.model'),
    Episode = require('../api/episode/episode.model'),
    ParsedSubtitle = require('../api/subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../api/parsed_word/parsed_word.model');


var targetDir = 'api/anime/imports/first/fairy_tail/';
var targetEp = '2';
var parsedEntries;
var subParsed = [];
var parsedIndex = 0;
var previousTimecode = '00:00:00.0';
var outputTimecode;


var command = new FfmpegCommand();


Anime.findOne({title: 'Fairy Tail'}).populate({
    path: 'episodes'
    , select: 'title sub_parsed'
    , match: { episode: targetEp }
    , options: { limit: 1 }
}).exec(function (err, anime) {
    parsedEntries = anime.episodes[0].sub_parsed;
    //splitVideo();
    //fingerprintVideo();
    getSubParsed();
});

//function fingerprintVideo(){
//
//    SubtitlesParsed.findById(parsedEntries[parsedIndex], function(err, parsed){
//
//        var diff = calcTimeDif(parsed.end_hours, parsed.end_minutes, parsed.end_seconds)
//
//        if(diff) {
//            var options = {
//                file: __dirname + '/../' + targetDir + 'Fairy_Tail_002.mp4',
//                index: tcToSeconds(previousTimecode),
//                offset: diff
//            };
//
//            codegen(options, function (err, data) {
//                if (err) return console.error(err);
//                console.log(data);
//            });
//        }else{
//            parsedIndex += 1;
//            fingerprintVideo();
//        }
//
//    });
//
//}

function tcToSeconds(tc){

    var prev = tc.match(/([0-9]{1,2})/g);
    var hours = parseInt(prev[0]) * 60 * 60;
    var minutes = parseInt(prev[1]) * 60;
    var seconds = parseInt(prev[2]);

    return hours + minutes + seconds;
}

function getSubParsed(){
    if(parsedEntries.length > parsedIndex + 1) {
        ParsedSubtitle.findById(parsedEntries[parsedIndex], function (err, parsed) {
            subParsed.push(parsed);
            parsedIndex += 1;
            getSubParsed();
        })
    }else{
        parsedIndex = 0;
        //console.log(subParsed.length)
        splitVideo();
    }

}

function splitVideo(){
    if(subParsed.length > parsedIndex + 1) {
        var seekInput = previousTimecode;
        outputTimecode = subParsed[parsedIndex].end_hours + ':' + subParsed[parsedIndex].end_minutes + ':' + subParsed[parsedIndex].end_seconds + '.0';
        var calcTime = calcTimeDif(subParsed[parsedIndex].end_hours, subParsed[parsedIndex].end_minutes, subParsed[parsedIndex].end_seconds);

        if (calcTime) {

            //command
            //    .input(__dirname + '/../' + targetDir + 'Fairy_Tail_002.mp4')
            //    .seekInput(seekInput)
            //    .withNoVideo()
            //    .outputOptions([
            //        '-acodec copy',
            //        '-to ' + outputTimecode
            //    ])
            //    .outputOptions([
            //        '-acodec copy',
            //        '-to ' + outputTimecode
            //    ])
            //    .on('progress', function (progress) {
            //        if(progress.percent % 20 < 0.5) {
            //            console.log('Processing: ' + progress.percent + '% done');
            //        }
            //    })
            //    .on('error', function (err) {
            //        console.log('An error occurred: ' + err.message);
            //    })
            //    .on('end', function () {
            //        console.log('Finished processing ' + parsedIndex);
            //        parsedIndex += 1;
            //        previousTimecode = outputTimecode;
            //        splitVideo()
            //    })
            //    .save(__dirname + '/../' + targetDir + 'Fairy_Tail_002_parts/' + parsedIndex + '.aac');


            console.log(seekInput + ' - ' + outputTimecode)
            console.log(parsedIndex)
            previousTimecode = outputTimecode;
            splitVideo();

        } else {
            parsedIndex += 1;
            //console.log('Skipped one');

            splitVideo()
        }
    }else{
        console.log('Done with splicing')
    }
}

function calcTimeDif(hours, minutes, seconds){

    hours = hours * 60 * 60;
    minutes = minutes * 60;
    var newTotal = hours + minutes + seconds;

    var prevTotal = tcToSeconds(previousTimecode);

    var diff = newTotal - prevTotal;

    return diff > 25;

}

