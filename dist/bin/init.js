const fs = require('fs')
const path = require('path')

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
    } else {
        return true
    }

    var modelsDir = path.dirname("santuy/models/models")
    if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir)
    } else {
        return true
    }

    var seedsDir = path.dirname("santuy/seeds/seeds")
    if (!fs.existsSync(seedsDir)) {
        fs.mkdirSync(seedsDir)
    } else {
        return true
    }
    return false
}

const models = `

//define all models
const models = {
    
}
module.exports = { models }
`

async function createModel() {
    var dirname = path.dirname("santuy/models")

    fs.writeFileSync(`${dirname}/schema.js`, models, 'utf-8')
    console.log(`${dirname}/schema.js`)

}

module.exports = { initCLI }