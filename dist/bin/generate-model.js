const fs = require('fs')
const path = require('path')
require("dotenv").config()

async function generateModel(args) {
    if (args[2]) {
        console.log("MODEL GENERATOR\n")
        console.log(`--------------------------------------\n\n`)
        console.log(`Generating model ${args[2]}\n`)
        let model = args[2]
        model = model.toLowerCase()
        var dirname = path.dirname("santuy/models")
        if (fs.existsSync(`${dirname}/models/${model}.js`)) {
            console.error(`error: Model ${args[2]} exists!\n`)
            process.exit(0)
        }
        fs.writeFileSync(`${dirname}/models/${model}.js`, generateModelfile(model), 'utf-8')
        generateModelsfile(model).then((data) => {
            fs.writeFileSync(`${dirname}/schema.js`, data, 'utf-8')
        })


        console.log(`${dirname}/models/${model}.js`)
        console.log(`${dirname}/schema.js`)
        console.log(`Model ${args[2]} has been generated!\n`)
    } else {
        help()
    }

}

function generateModelfile(model) {
    model = model.toLowerCase()
    const capModel = capitalizeFirstLetter(model)
    const modelCode = `
        const ${capModel}Model = {
            name: '${model}',
            icon: 'AiFillCaretRight',
            columns: [
                {
                    name: 'id',
                    title: 'ID',
                    dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
                    inputType: 'number',
                },
            ],
        }


        module.exports = ${capModel}Model
    `

    return modelCode
}

async function generateModelsfile(model) {
    let jsFile = "../../../../santuy/schema.js"
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        jsFile = "../../santuy/schema.js"
    }
    const { models } = require(jsFile)
    const capModel = capitalizeFirstLetter(model)
    let importModels = ""
    let allModels = Object.keys(models)
    let allModelsStr = ""
    for (const item of allModels) {
        let capItem = capitalizeFirstLetter(item)
        importModels += `const ${capItem}Model = require("./models/${item}.js") \n`
        allModelsStr += `
        ${item}:${capItem}Model,
        `
    }
    importModels += `const ${capModel}Model = require("./models/${model}.js") \n`
    allModelsStr += `
        ${model}:${capModel}Model,
        `

    const modelsCode = `
        ${importModels}

        const models = {
            ${allModelsStr}
        }


        module.exports = { models }
    `
    return modelsCode
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = { generateModel }