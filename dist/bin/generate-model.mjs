import fs from 'fs'
import path from 'path'
import 'dotenv/config'

async function generateModel(args) {
    if (args[2]) {
        console.log("MODEL GENERATOR\n")
        console.log(`--------------------------------------\n\n`)
        console.log(`Generating model ${args[2]}\n`)
        let model = args[2]
        var dirname = path.dirname("santuy/models")
        if (fs.existsSync(`${dirname}/models/${model}.mjs`)) {
            console.error(`error: Model ${args[2]} exists!\n`)
            process.exit(0)
        }
        fs.writeFileSync(`${dirname}/models/${model}.mjs`, generateModelfile(model), 'utf-8')
        generateModelsfile(model).then((data) => {
            fs.writeFileSync(`${dirname}/schema.mjs`, data, 'utf-8')
        })


        console.log(`${dirname}/models/${model}.mjs`)
        console.log(`${dirname}/schema.mjs`)
        console.log(`Model ${args[2]} has been generated!\n`)
    } else {
        help()
    }

}

function generateModelfile(model) {
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


        export default ${capModel}Model
    `

    return modelCode
}

async function generateModelsfile(model) {
    let jsFile = "../../../../santuy/schema.mjs"
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        jsFile = "../../santuy/schema.mjs"
    }
    const { models } = await import(jsFile)
    const capModel = capitalizeFirstLetter(model)
    let importModels = ""
    let allModels = Object.keys(models)
    let allModelsStr = ""
    for (const item of allModels) {
        let capItem = capitalizeFirstLetter(item)
        importModels += `import ${capItem}Model from "./models/${item}.mjs" \n`
        allModelsStr += `
        ${item}:${capItem}Model,
        `
    }
    importModels += `import ${capModel}Model from "./models/${model}.mjs" \n`
    allModelsStr += `
        ${model}:${capModel}Model,
        `

    const modelsCode = `
        ${importModels}

        const models = {
            ${allModelsStr}
        }


        export { models }
    `
    return modelsCode
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export { generateModel }