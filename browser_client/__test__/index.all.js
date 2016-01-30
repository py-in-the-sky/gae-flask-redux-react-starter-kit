import './setup'


const unitTests = require.context('.', true, /-test\.js$/)
unitTests.keys().forEach(unitTests)


const e2eTests = require.context('./e2e', true, /-e2e\.js$/)
e2eTests.keys().forEach(e2eTests)
