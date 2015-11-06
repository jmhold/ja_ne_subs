var parser = require('subtitles-parser');

var SrtHelper = {
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
            returnObj.start_seconds = parseInt(start[2].substring(0, index));

            var end = parseObj[i].endTime.split(':');
            returnObj.end_hours = parseInt(end[0]);
            returnObj.end_minutes = parseInt(end[1]);
            index = end[2].indexOf(',');
            returnObj.end_seconds = parseInt(end[2].substring(0, index));

            //Display Text

            returnObj.display_text = parseObj[i].text;
            returnArray.push(returnObj);

        }

        return returnArray;
    }
};

module.exports = SrtHelper;