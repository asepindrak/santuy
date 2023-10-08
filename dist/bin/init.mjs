import fs from 'fs'
import path from 'path'

const initCLI = () => {
    console.log("INIT\n")
    console.log(`--------------------------------------\n\n`)

    let check = ensureDirectoryExistence()
    if (check) {
        console.error("Folder santuy exists. Remove first, please!")
        process.exit(0)
    }
    createModel()
    console.log("Santuy has been initialized!")
    process.exit(0)
}

function ensureDirectoryExistence() {
    var santuyDir = path.dirname("santuy/models")
    if (!fs.existsSync(santuyDir)) {
        fs.mkdirSync(santuyDir)
    }

    var modelsDir = path.dirname("santuy/models/models")
    if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir)
    }

    var seedsDir = path.dirname("santuy/seeds/seeds")
    if (!fs.existsSync(seedsDir)) {
        fs.mkdirSync(seedsDir)
    }
}

const models = `

//define all models
const models = {
    
}
export { models }
`



async function createModel() {
    var dirname = path.dirname("santuy/models")

    fs.writeFileSync(`${dirname}/schema.mjs`, models, 'utf-8')
    console.log(`${dirname}/schema.mjs`)

}

export { initCLI }