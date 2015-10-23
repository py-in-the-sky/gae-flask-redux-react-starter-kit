module.exports = function (config) {
    var karmaSettings = require('./karma.make')({
        __INTEGRATION__: true,
    });

    config.set(karmaSettings);
};
