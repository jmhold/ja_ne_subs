/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /vocabs              ->  index
 * POST    /vocabs              ->  create
 * GET     /vocabs/:id          ->  show
 * PUT     /vocabs/:id          ->  update
 * DELETE  /vocabs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Vocab = require('./vocab.model');

// Get list of vocabs
exports.index = function(req, res) {
  Vocab.find(function (err, vocabs) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(vocabs);
  });
};

// Get a single vocab
exports.show = function(req, res) {
  Vocab.findById(req.params.id, function (err, vocab) {
    if(err) { return handleError(res, err); }
    if(!vocab) { return res.status(404).send('Not Found'); }
    return res.json(vocab);
  });
};

// Creates a new vocab in the DB.
exports.create = function(req, res) {
  Vocab.create(req.body, function(err, vocab) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(vocab);
  });
};

// Updates an existing vocab in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Vocab.findById(req.params.id, function (err, vocab) {
    if (err) { return handleError(res, err); }
    if(!vocab) { return res.status(404).send('Not Found'); }
    var updated = _.merge(vocab, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(vocab);
    });
  });
};

// Deletes a vocab from the DB.
exports.destroy = function(req, res) {
  Vocab.findById(req.params.id, function (err, vocab) {
    if(err) { return handleError(res, err); }
    if(!vocab) { return res.status(404).send('Not Found'); }
    vocab.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}