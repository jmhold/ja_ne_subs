var AssHelper = {

    toMiliseconds: function(time){
        var mili = 0;
        mili += parseInt(time[0]) * 3600000;
        mili += parseInt(time[1]) * 60000;
        mili += parseInt(time[2]) * 1000;

        return mili;
    },

    parseLine: function (data) {

        var timecodes,
            start,
            end;

        var text;

        var returnObj = {};

        if (data.indexOf('Dialogue: ') == -1) {
            return false;
        }

        timecodes = data.match(/([0-9])+(:)+([0-9])\d+(:)+([0-9])\d/g);

        start = timecodes[0];
        start = start.split(':');

        returnObj.start_hours = parseInt(start[0]);
        returnObj.start_minutes = parseInt(start[1]);
        returnObj.start_seconds = parseInt(start[2]);

        end = timecodes[1];
        end = end.split(':');
        returnObj.end_hours = parseInt(end[0]);
        returnObj.end_minutes = parseInt(end[1]);
        returnObj.end_seconds = parseInt(end[2]);

        returnObj.start = AssHelper.toMiliseconds(start);
        returnObj.end = AssHelper.toMiliseconds(end);

        text = data.substring(data.lastIndexOf(',') + 1);

        returnObj.display_text = text;

        return returnObj;
    },
    parseSubFile: function (data, callback) {
        var remaining = '';
        var lineObject = [];

        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            if (AssHelper.parseLine(line)) {
                lineObject.push(AssHelper.parseLine(line));
            }
            index = remaining.indexOf('\n');
        }

        callback(lineObject);

    }
};

module.exports = AssHelper;
