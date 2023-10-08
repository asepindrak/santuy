import { generateModel } from './generate-model.mjs'
import { generateSeed } from './generate-seed.mjs'
import { help } from './help.mjs'

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