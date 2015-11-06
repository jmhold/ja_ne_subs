'use strict';

var _ = require('lodash');
var Subtitle = require('./subtitle.model');

// Get list of subtitles
exports.index = function(req, res) {
  Subtitle.find(function (err, subtitles) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(subtitles);
  });
};

// Get a single subtitle
exports.show = function(req, res) {
  Subtitle.findById(req.params.id, function (err, subtitle) {
    if(err) { return handleError(res, err); }
    if(!subtitle) { return res.status(404).send('Not Found'); }
    return res.json(subtitle);
  });
};

// Creates a new subtitle in the DB.
exports.create = function(req, res) {
  Subtitle.create(req.body, function(err, subtitle) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(subtitle);
  });
};

// Updates an existing subtitle in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Subtitle.findById(req.params.id, function (err, subtitle) {
    if (err) { return handleError(res, err); }
    if(!subtitle) { return res.status(404).send('Not Found'); }
    var updated = _.merge(subtitle, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(subtitle);
    });
  });
};

// Deletes a subtitle from the DB.
exports.destroy = function(req, res) {
  Subtitle.findById(req.params.id, function (err, subtitle) {
    if(err) { return handleError(res, err); }
    if(!subtitle) { return res.status(404).send('Not Found'); }
    subtitle.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}