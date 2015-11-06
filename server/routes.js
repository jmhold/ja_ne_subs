/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/parsed_words', require('./api/parsed_word'));
  app.use('/api/anime_genres', require('./api/anime_genre'));
  app.use('/api/subtitles_parsed_types', require('./api/subtitles_parsed_type'));
  app.use('/api/subtitles_parseds', require('./api/subtitles_parsed'));
  app.use('/api/subtitles', require('./api/subtitle'));
  app.use('/api/episodes', require('./api/episode'));
  app.use('/api/animes', require('./api/anime'));
  app.use('/api/vocabs', require('./api/vocab'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
