/**
 * Populate DB with vocab data on server start
 * to disable, edit config/environment/index.js, and set `importVocab: false`
 */

'use strict';

var fs = require('fs');

var Vocab = require('../api/vocab/vocab.model');

fs.readdirSync(__dirname + '/../api/vocab/imports').forEach(function(filename){

    var file = fs.readFileSync(__dirname + '/../api/vocab/imports/' + filename, 'utf8');
    var json = JSON.parse(file);

    json.items.forEach(function(obj){
        Vocab.find({}).remove(function() {
            Vocab.create(
                {
                    active: true,
                    language: obj.cue.related.language,
                    part_of_speech: obj.cue.related.part_of_speech,
                    text: obj.cue.content.text,
                    sound: "",
                    translations: [{
                        language: obj.response.related.language,
                        text: obj.response.content.text
                    }],
                    transliterations: obj.cue.related.transliteraions
                }
            );

        });
    });
    console.log('finished populating vocabulary');
});

