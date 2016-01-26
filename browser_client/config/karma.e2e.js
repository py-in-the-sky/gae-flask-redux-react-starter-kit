/* eslint-disable no-var */


module.exports = function (config) {
    var karmaSettings = require('./karma.make')({
        __E2E__: true,
    });

    config.set(karmaSettings);
};
