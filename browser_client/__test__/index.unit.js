import './setup'


const unitTests = require.context('.', true, /-test\.js$/)
unitTests.keys().forEach(unitTests)
