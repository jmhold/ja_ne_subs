var parser = require('subtitles-parser');

var SrtHelper = {

    toMiliseconds: function(time){
        var mili = 0;
        mili += parseInt(time[0]) * 3600000;
        mili += parseInt(time[1]) * 60000;
        mili += parseInt(time[2]) * 1000;

        return mili;
    },

    parseSubFile: function(file){
        var returnArray = [],
            parseObj = parser.fromSrt(file);

        for(var i in parseObj){
            var returnObj = {};


            //Timecodes
            var start = parseObj[i].startTime.split(':');
            returnObj.start_hours = parseInt(start[0]);
            returnObj.start_minutes = parseInt(start[1]);
            var index = start[2].indexOf(',');
            start[2] = start[2].substring(0, index)
            returnObj.start_seconds = parseInt(start[2]);

            var end = parseObj[i].endTime.split(':');
            returnObj.end_hours = parseInt(end[0]);
            returnObj.end_minutes = parseInt(end[1]);
            index = end[2].indexOf(',');
            end[2] = end[2].substring(0, index)
            returnObj.end_seconds = parseInt(end[2]);

            returnObj.start = SrtHelper.toMiliseconds(start);
            returnObj.end = SrtHelper.toMiliseconds(end);

            //Display Text

            returnObj.display_text = parseObj[i].text;
            returnArray.push(returnObj);

        }

        return returnArray;
    }
};

module.exports = SrtHelper;