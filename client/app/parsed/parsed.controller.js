'use strict';

angular.module('jaNeSubsApp')
  .controller('ParsedCtrl', function ($scope, $http, $stateParams) {
      $http.get('/api/subtitles_parsed/'+$stateParams.id).success(function(parsed) {

        var words = parsed.parsed_words;
        //console.log(words)
          angular.forEach(parsed.parsed_words, function(word){
              if(word.vobab_link.length == 0){
                  $http.get('https://www.googleapis.com/language/translate/v2?q=' + word.text + '&target=en&source=ja&key=AIzaSyA5rTNSmSE2QbyvjjTulvnthkYjm1-YLbw')
                      .then(function(response){
                          console.log(response)
                          word.vobab_link = [{
                              active: true,
                              language: "ja",
                              text: word.text,
                              part_of_speech: word.pos_main,
                              translations: [
                                  {
                                      language:'en',
                                      text:response.data.data.translations[0].translatedText
                                  }
                              ]
                          }]
                      }
                  )
              }
          });

          $scope.parsed = parsed;

      });
    });
