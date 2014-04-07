function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    var milliseconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (milliseconds < 10) {
        milliseconds = "00" + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = "0" + milliseconds;
    }
    str += hours + ":" + minutes + ":" + seconds + "." + milliseconds + " ";

    return str;
}

function copyObject(origin) {
    // If it's an array
    if (Object.prototype.toString.call( origin ) === '[object Array]') {
        var newArray = [];
        for (var i=0; i<origin.length; i++) {
            newArray[i] = copyObject(origin[i]);
        }
        return newArray;

    // If it's a JSON object
    } else if (typeof origin == 'object') {
        var newObj = {};
        var keys = Object.keys(origin);
        for (var key in origin) {
            newObj[key] = copyObject(origin[key]);
        }
        return newObj;

    // if normal value
    } else if (typeof origin == 'boolean' || typeof origin == 'number' || typeof origin == 'string') {
        return origin;
    }

    return 'error';
}

function getBytesNumber(json) {
    return JSON.stringify(json).length * 8 + ' bytes';
}