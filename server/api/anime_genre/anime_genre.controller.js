'use strict';

var _ = require('lodash');
var AnimeGenre = require('./anime_genre.model');

// Get list of anime_genres
exports.index = function(req, res) {
  AnimeGenre.find(function (err, anime_genres) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(anime_genres);
  });
};

// Get a single anime_genre
exports.show = function(req, res) {
  AnimeGenre.findById(req.params.id, function (err, anime_genre) {
    if(err) { return handleError(res, err); }
    if(!anime_genre) { return res.status(404).send('Not Found'); }
    return res.json(anime_genre);
  });
};

// Creates a new anime_genre in the DB.
exports.create = function(req, res) {
  AnimeGenre.create(req.body, function(err, anime_genre) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(anime_genre);
  });
};

// Updates an existing anime_genre in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  AnimeGenre.findById(req.params.id, function (err, anime_genre) {
    if (err) { return handleError(res, err); }
    if(!anime_genre) { return res.status(404).send('Not Found'); }
    var updated = _.merge(anime_genre, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(anime_genre);
    });
  });
};

// Deletes a anime_genre from the DB.
exports.destroy = function(req, res) {
  AnimeGenre.findById(req.params.id, function (err, anime_genre) {
    if(err) { return handleError(res, err); }
    if(!anime_genre) { return res.status(404).send('Not Found'); }
    anime_genre.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}