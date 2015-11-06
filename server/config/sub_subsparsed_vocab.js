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
    SubtitlesParsed = require('../api/subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../api/parsed_word/parsed_word.model');

var Mecab = require('mecab-lite'),
    mecab = new Mecab();

var parsed;
var targetDir = '/api/anime/imports/first/one_piece/';
var allFiles;
var fileIndex = 0;
var parsedIndex = 0;
var wordIndex = 0;
var finalParsedSubs = [];
var filename = '';

var wordList = [];


//SubtitlesParsed.find({}).remove();
//ParsedWord.find({}).remove();

var linkEpisodeRecord = function(){

    var epNumber = filename.match(/([0-9]{3})/g);
    epNumber = parseInt(epNumber);
    epNumber = epNumber.toString();

    //Episode.update({"episode" : epNumber}, {$set: {
    //    sub_file_location: (targetDir + filename),
    //    sub_parsed: finalParsedSubs
    //}}, function(){
    //    console.log('finished populating subtitles and words for ' + epNumber);
    //    fileIndex+=1;
    //    getFile(fileIndex)
    //});

    Episode.findOne({"episode" : epNumber}, function(err, episode){
        episode.sub_file_location = targetDir + filename;
        episode.sub_parsed = finalParsedSubs;
        episode.save(function (err, item, numAffected) {
            if (err) console.log(err)
            console.log(item)
            console.log(numAffected);
            fileIndex+=1;
            getFile(fileIndex)
        });
    });

};

var createSubtitleParsedEntry = function(){

    var thisTime = parsed[parsedIndex];

    var subtitleParsedEntry = new SubtitlesParsed({
        start_hours: thisTime.start_hours,
        start_minutes: thisTime.start_minutes,
        start_seconds: thisTime.start_seconds,
        end_hours: thisTime.end_hours,
        end_minutes: thisTime.end_minutes,
        end_seconds: thisTime.end_seconds,
        display_text: thisTime.display_text,
        parsed_words: wordList
    });

    finalParsedSubs.push(subtitleParsedEntry);

    subtitleParsedEntry.save(function (err) {
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
        if (thisTime.display_text != undefined && wordList == []) {
            wordList = MecabHelper.getWordEntries(thisTime.display_text);
        }
        if (wordList.length > wordIndex + 1) {
            createWordEntry();
        } else {
            //console.log('completed word entries');
            wordIndex = 0;
            createSubtitleParsedEntry();
        }
    }else{
        console.log(parsed[parsedIndex])
    }

};

var createWordEntry = function(){
    wordList[wordIndex].save(function (err) {
        if (err) console.log(err);
        wordIndex += 1;
        parseWordEntry();
    });
};

var getFile = function(fileIndex){

    parsedIndex = 0;
    finalParsedSubs = [];

    console.log(filename);

    if(allFiles.length > fileIndex){

        filename = allFiles[fileIndex];

        fs.readFile(__dirname + '/..' + targetDir + filename, 'utf8', function(err, file){
            console.log(filename);
            if(filename.indexOf('.ass') > -1){
                console.log('ASS FILE');
                parsed = AssHelper.parseSubFile(file);
            }else if(filename.indexOf('.srt') > -1){
                console.log('SRT FILE');

                parsed = SrtHelper.parseSubFile(file);
            }else{
                parsed = null;
                console.log('NOT A FORMAT I UNDERSTAND')
            }
            //var interval = setInterval(function(){
            //    console.log(parsed)
            //},500);
            if(parsed != null){
                parseWordEntry();
                //createSubtitleParsedEntry(parsed);
            }else{
                fileIndex+=1;
                getFile(fileIndex)
            }
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
        getFile(fileIndex)
    });
};

getFiles();

//fs.readdirSync(__dirname + '/..' + targetDir).forEach(function(filename){
//
//    var finalParsedSubs = [];
//
//    //Get the file from dir
//    var file = fs.readFileSync(__dirname + '/..' + targetDir + filename, 'utf8');
//
//    //Parse into subtitle entries
//    if(filename.indexOf('.ass') > -1){
//        parsed = AssHelper.parseSubFile(file);
//    }else if(filename.indexOf('.srt')){
//        parsed = SrtHelper.parseSubFile(file);
//    }else{
//        console.log('NOT A FORMAT I UNDERSTAND')
//    }
//
//    console.log("parsed: " + filename);
//
//    //Create subtitle entries based on parsed data from file
//    for(var i in parsed){
//
//        //Take display text and parse it into saved word entries
//        var wordList = MecabHelper.createWordEntries(parsed[i].display_text);
//
//        var subtitleParsedEntry = new SubtitlesParsed({
//            start_hours: parsed[i].start_hours,
//            start_minutes: parsed[i].start_minutes,
//            start_seconds: parsed[i].start_seconds,
//            end_hours: parsed[i].end_hours,
//            end_minutes: parsed[i].end_minutes,
//            end_seconds: parsed[i].end_seconds,
//            display_text: parsed[i].display_text,
//            parsed_words: wordList
//        });
//
//        subtitleParsedEntry.save(function (err) {
//            if (err) console.log(err);
//            console.log("New Parsed Entry");
//        });
//
//        finalParsedSubs.push(subtitleParsedEntry);
//    }
//
//
//
//});






//var encoded = Encoding.stringToCode(returnObj.display_text);
//console.log(returnObj.display_text + ' : ' + encoded)
//var file = fs.createReadStream(__dirname + '/../api/anime/imports/first/fairy_tail/Fairy_Tail_001.ass', 'utf8');
//var look = AssHelper.parseSubFile(file);
//console.log(look);


//

//
//var attachVocabID = function(text, index){
//    Vocab.findOne({"text" : text}, '_id', function(err, vocab){
//        if(vocab) parsed_display_text[index].vocabRef = vocab._id;
//        console.log(parsed_display_text[index].vocabRef)
//    });
//};
//




//mecab.parse('引数なしで解析すると、必ず結果の終端に', function(err, result){
//    if(err) throw err;
//
//    for(var i in result){
//        var returnObj = {};
//        for(var j in allPOS){
//            if(result[i][1] == allPOS[j].ja){
//
//                returnObj.text = result[i][0];
//                returnObj.pos_main = allPOS[j].en;
//
//                if(allPOS[j].subPOS && result[i][2] != '*'){
//                    for(var k in allPOS[j].subPOS){
//                        if(result[i][2] == allPOS[j].subPOS[k].ja){
//                            returnObj.pos_sub1 = allPOS[j].subPOS[k].en;
//                        }
//                    }
//                }
//            }
//        }
//        if(returnObj.text) parsed_display_text.push(returnObj);
//    }
//    console.log(parsed_display_text)
//});


//var temp = '%m\t%f[7]\t%f[6]\t%F-[0,1,2,3]\t%f[4]\t%f[5]\n';
//
//var newTemp = '';
//newTemp += '{\n';
//newTemp += 'word:%m,\n';
//newTemp += 'parts_of_speech:{\n';
//newTemp += 'main:%f[7]\n';
//newTemp += 'sub1:%f[8]\n';
//newTemp += 'sub2:%f[9]\n';
//newTemp += '}\n';

