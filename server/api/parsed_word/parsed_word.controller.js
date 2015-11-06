'use strict';

var _ = require('lodash');
var ParsedWord = require('./parsed_word.model');

// Get list of parsed_words
exports.index = function(req, res) {
  ParsedWord.find(function (err, parsed_words) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(parsed_words);
  });
};

// Get a single parsed_word
exports.show = function(req, res) {
  ParsedWord.findById(req.params.id, function (err, parsed_word) {
    if(err) { return handleError(res, err); }
    if(!parsed_word) { return res.status(404).send('Not Found'); }
    return res.json(parsed_word);
  });
};

// Creates a new parsed_word in the DB.
exports.create = function(req, res) {
  ParsedWord.create(req.body, function(err, parsed_word) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(parsed_word);
  });
};

// Updates an existing parsed_word in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ParsedWord.findById(req.params.id, function (err, parsed_word) {
    if (err) { return handleError(res, err); }
    if(!parsed_word) { return res.status(404).send('Not Found'); }
    var updated = _.merge(parsed_word, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(parsed_word);
    });
  });
};

// Deletes a parsed_word from the DB.
exports.destroy = function(req, res) {
  ParsedWord.findById(req.params.id, function (err, parsed_word) {
    if(err) { return handleError(res, err); }
    if(!parsed_word) { return res.status(404).send('Not Found'); }
    parsed_word.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}