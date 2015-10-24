module.exports = function (config) {
    var karmaSettings = require('./karma.make')({
        __COVERAGE__: true,
    });

    config.set(karmaSettings);
};
