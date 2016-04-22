'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/janesubs-dev'
  },

  seedDB: false,
  importVocab: false,
  importAnimeEpisode: true,
  importSubs: false,
  importFingerprints: false
};
