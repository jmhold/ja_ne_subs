'use strict';

var _ = require('lodash');
var Episode = require('./episode.model');

// Get list of episodes
exports.index = function(req, res) {
  Episode.find(function (err, episodes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(episodes);
  });
};

// Get a single episode
exports.show = function(req, res) {
  Episode.findById(req.params.id, function (err, episode) {
    if(err) { return handleError(res, err); }
    if(!episode) { return res.status(404).send('Not Found'); }
    return res.json(episode);
  });
};

// Creates a new episode in the DB.
exports.create = function(req, res) {
  Episode.create(req.body, function(err, episode) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(episode);
  });
};

// Updates an existing episode in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Episode.findById(req.params.id, function (err, episode) {
    if (err) { return handleError(res, err); }
    if(!episode) { return res.status(404).send('Not Found'); }
    var updated = _.merge(episode, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(episode);
    });
  });
};

// Deletes a episode from the DB.
exports.destroy = function(req, res) {
  Episode.findById(req.params.id, function (err, episode) {
    if(err) { return handleError(res, err); }
    if(!episode) { return res.status(404).send('Not Found'); }
    episode.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}