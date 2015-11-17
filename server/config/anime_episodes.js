/**
 * Populate DB with anime show and episode data on server start
 * to disable, edit config/environment/index.js, and set `importAnimeEpisode: false`
 */

'use strict';

var fs = require('fs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Anime = require('../api/anime/anime.model');
var Episode = require('../api/episode/episode.model');

var file = fs.readFileSync(__dirname + '/../api/anime/imports/first/fairy_tail.json', 'utf8');
var json = JSON.parse(file);

var finalEpisodeList = [];

Episode.find({}).remove(function(){
    var jsonEpisodeList = json.anime.episodes.episode;

    for(var i in jsonEpisodeList){

        var episodeNumber = jsonEpisodeList[i].epno['__text'];
        var title;
        for(var j in jsonEpisodeList[i].title){
            if(jsonEpisodeList[i].title[j]['_xml:lang'] == 'en'){
                title = jsonEpisodeList[i].title[j]['__text'];
            }
        }
        var airDate = jsonEpisodeList[i].airdate;

        var episode = new Episode({
            active: true,
            episode: episodeNumber,
            title: title,
            air_date: airDate
        });

        finalEpisodeList.push(episode);
        episode.save(function (err) {
            if (err) console.log(err)
        });
    }
    addAnime();
});



function addAnime(){
    //Find Anime Title in JSON
    var title = json.anime.titles.title[0]['__text'];

//Find Anime Episode Count in JSON
    var episodecount = parseInt(json.anime.episodecount);

//Find Anime Start Date in JSON
    var start_date = json.anime.startdate;

//Find Anime End Date in JSON
    var end_date = json.anime.enddate;

//Find Anime Description in JSON
    var desc = json.anime.description;

    Anime.find({}).remove(function(){
        Anime.create({
            active: true,
            title: title,
            episode_count: episodecount,
            start_date: start_date,
            end_date: end_date,
            desc: desc,
            episodes: finalEpisodeList
        }, function() {
            console.log('finished populating animes');
            //showAnime()
        })
    });

}

//function showAnime(){
//    Anime.findOne({ title: 'Fairy Tail' }, 'title episode_count episodes', function(err, anime){
//        if(err) console.log(err);
//        console.log('%s has %s episodes.', anime.title, anime.episode_count)
//    });
//}

