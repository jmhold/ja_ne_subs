'use strict';

var _ = require('lodash');
var SubtitlesParsedType = require('./subtitles_parsed_type.model');

// Get list of subtitles_parsed_types
exports.index = function(req, res) {
  SubtitlesParsedType.find(function (err, subtitles_parsed_types) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(subtitles_parsed_types);
  });
};

// Get a single subtitles_parsed_type
exports.show = function(req, res) {
  SubtitlesParsedType.findById(req.params.id, function (err, subtitles_parsed_type) {
    if(err) { return handleError(res, err); }
    if(!subtitles_parsed_type) { return res.status(404).send('Not Found'); }
    return res.json(subtitles_parsed_type);
  });
};

// Creates a new subtitles_parsed_type in the DB.
exports.create = function(req, res) {
  SubtitlesParsedType.create(req.body, function(err, subtitles_parsed_type) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(subtitles_parsed_type);
  });
};

// Updates an existing subtitles_parsed_type in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  SubtitlesParsedType.findById(req.params.id, function (err, subtitles_parsed_type) {
    if (err) { return handleError(res, err); }
    if(!subtitles_parsed_type) { return res.status(404).send('Not Found'); }
    var updated = _.merge(subtitles_parsed_type, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(subtitles_parsed_type);
    });
  });
};

// Deletes a subtitles_parsed_type from the DB.
exports.destroy = function(req, res) {
  SubtitlesParsedType.findById(req.params.id, function (err, subtitles_parsed_type) {
    if(err) { return handleError(res, err); }
    if(!subtitles_parsed_type) { return res.status(404).send('Not Found'); }
    subtitles_parsed_type.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}