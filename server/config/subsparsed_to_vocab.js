'use strict';

var Encoding = require('encoding-japanese'),
    MecabHelper = require(__dirname +'/import_helpers/mecab_helper'),
    Vocab = require('../api/vocab/vocab.model'),
    ParsedSubtitle = require('../api/subtitles_parsed/subtitles_parsed.model'),
    ParsedWord = require('../api/parsed_word/parsed_word.model');

var parsed,
    parsedIndex = 0,
    wordList = [],
    wordIndex = 0,
    links,
    linkIndex = 0;

var skipToVocab = false;

var ParsedToVocab = {
  init: function(){
    if(skipToVocab){
      getEmptyVocabLinks();
    }else{
      console.log("ParsedToVocab Started!");
      ParsedWord.find({}).remove(function(){
          getEmptyParsedWords();
      });
    }
  }
}

function getEmptyParsedWords(){
  ParsedSubtitle.find()
    .where({'parsed_words':[]})
    .exec(function(err, returnedParsed){
      parsed = returnedParsed;
      parseWordEntry()
    });
}

function parseWordEntry(){

    var thisTime = parsed[parsedIndex];

    if(thisTime != undefined) {
        if (thisTime.display_text != undefined && wordList.length == 0) {

            MecabHelper.getWordEntries(thisTime.display_text, function(entries){
              wordList = entries;
              console.log(wordList.length);
              for(var i = 0; i < wordList.length; i++){
                console.log(wordList[i]);
                //createWordEntry(wordList[i]);
              }
              parsed[parsedIndex].parsed_words = wordList;
              parsed[parsedIndex].save(function(err){
                wordList = [];
                if(parsed.length > parsedIndex + 1){
                  nextParsedEntry()
                }else{
                  console.log("Done w/ ParsedWord");
                  getEmptyVocabLinks()
                }
              })
            });
        }
    }else{
      parsedIndex += 1;
      parseWordEntry();
    }
};

function nextParsedEntry(){
  parsedIndex += 1;
  parseWordEntry();
}

function createWordEntry(word){
    word.save(function (err, item) {
        if (err) console.log(err);
        wordIndex += 1;
        parseWordEntry();
    });

};


function getEmptyVocabLinks(){
  ParsedWord.find()
    .where({'vocab_link':[]})
    .exec(function(err, returnedLinks){
      links = returnedLinks;
      //console.log(links.length);
      parseVocabLinks()
    });
}

function parseVocabLinks(){
  //console.log(links[linkIndex]);
  if(links.length > linkIndex +1){
    Vocab.findOne({text: links[linkIndex].text}, function(err, vocab){
        if(vocab){
            links[linkIndex].vocab_link.push(vocab);
            links[linkIndex].save();
        }
      linkIndex++
      parseVocabLinks()
    })
  }
}

module.exports = ParsedToVocab;
