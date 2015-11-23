'use strict';

var _ = require('lodash');
var ParsedSubtitle = require('./subtitles_parsed.model');

// Get list of subtitles_parseds
exports.index = function(req, res) {
  ParsedSubtitle.find(function (err, subtitles_parseds) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(subtitles_parseds);
  });
};

// Get a single subtitles_parsed
exports.show = function(req, res) {
  ParsedSubtitle.findById(req.params.id)
      .populate('parsed_words')
      .exec(function (err, subtitles_parsed) {
        if(err) { return handleError(res, err); }
        if(!subtitles_parsed) { return res.status(404).send('Not Found'); }
        return res.json(subtitles_parsed);
      });
};

// Creates a new subtitles_parsed in the DB.
exports.create = function(req, res) {
  ParsedSubtitle.create(req.body, function(err, subtitles_parsed) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(subtitles_parsed);
  });
};

// Updates an existing subtitles_parsed in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ParsedSubtitle.findById(req.params.id, function (err, subtitles_parsed) {
    if (err) { return handleError(res, err); }
    if(!subtitles_parsed) { return res.status(404).send('Not Found'); }
    var updated = _.merge(subtitles_parsed, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(subtitles_parsed);
    });
  });
};

// Deletes a subtitles_parsed from the DB.
exports.destroy = function(req, res) {
  ParsedSubtitle.findById(req.params.id, function (err, subtitles_parsed) {
    if(err) { return handleError(res, err); }
    if(!subtitles_parsed) { return res.status(404).send('Not Found'); }
    subtitles_parsed.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}