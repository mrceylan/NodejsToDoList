var Logger = function () { };

Logger.prototype.info = function (log) {
    console.log(new Date()+'info:::::'+log);
};

Logger.prototype.debug = function (log) {
    console.log(new Date()+'debug:::::'+log);
};

Logger.prototype.error = function (log) {
    console.log(new Date()+'error:::::'+log);
};

module.exports = new Logger();