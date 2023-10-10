const { generateModel } = require('./generate-model.js')
const { generateSeed } = require('./generate-seed.js')
const { help } = require('./help.js')

const generateCLI = async (args) => {
    switch (args[1]) {
        case "model":
            generateModel(args)
            break
        case "seed":
            generateSeed(args)
            break
        default:
            help()
    }
}

module.exports = { generateCLI }