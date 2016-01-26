/* eslint-disable no-var */


module.exports = function (config) {
    var karmaSettings = require('./karma.make')({
        __ALL__: true,
    });

    config.set(karmaSettings);
};
