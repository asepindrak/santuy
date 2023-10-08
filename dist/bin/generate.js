import { generateModel } from './generate-model.js'
import { generateSeed } from './generate-seed.js'
import { help } from './help.js'

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



export { generateCLI }