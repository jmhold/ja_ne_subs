'use strict';

var _ = require('lodash');
var Anime = require('./anime.model');

// Get list of animes
exports.index = function(req, res) {
  Anime.find(function (err, animes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(animes);
  });
};

// Get a single anime
exports.show = function(req, res) {
  Anime.findById(req.params.id, function (err, anime) {
    if(err) { return handleError(res, err); }
    if(!anime) { return res.status(404).send('Not Found'); }
    return res.json(anime);
  });
};

// Creates a new anime in the DB.
exports.create = function(req, res) {
  Anime.create(req.body, function(err, anime) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(anime);
  });
};

// Updates an existing anime in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Anime.findById(req.params.id, function (err, anime) {
    if (err) { return handleError(res, err); }
    if(!anime) { return res.status(404).send('Not Found'); }
    var updated = _.merge(anime, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(anime);
    });
  });
};

// Deletes a anime from the DB.
exports.destroy = function(req, res) {
  Anime.findById(req.params.id, function (err, anime) {
    if(err) { return handleError(res, err); }
    if(!anime) { return res.status(404).send('Not Found'); }
    anime.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}