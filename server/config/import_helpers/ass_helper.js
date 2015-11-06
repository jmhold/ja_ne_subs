var AssHelper = {

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

        text = data.substring(data.lastIndexOf(',') + 1);

        returnObj.display_text = text;

        return returnObj;
    },
    parseSubFile: function (data) {
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

        if (remaining.length > 0) {
            AssHelper.parseLine(remaining);
        }else{
            return lineObject;
        }

    }
};

module.exports = AssHelper;
