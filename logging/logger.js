"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, prettyPrint = winston_1.format.prettyPrint;
var formatSetup = printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp;
    return "".concat(timestamp, " ").concat(message, " ").concat(level);
});
module.exports = function (dirname) {
    var levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
    };
    var levelKeys = Object.keys(levels);
    for (var _i = 0, levelKeys_1 = levelKeys; _i < levelKeys_1.length; _i++) {
        var level = levelKeys_1[_i];
        var logger = (0, winston_1.createLogger)({
            format: combine(timestamp(), formatSetup, prettyPrint()),
            transports: [
                new winston_1.transports.Console({
                    level: level,
                }),
            ],
        })[level];
        levels[level] = Object.create(logger, {});
    }
    return levels;
};
