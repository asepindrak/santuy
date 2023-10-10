const fs = require('fs')
const path = require('path')
require("dotenv").config()

async function generateSeed(args) {
    if (args[2]) {
        console.log("SEED GENERATOR\n")
        console.log(`--------------------------------------\n\n`)
        console.log(`Generating seed ${args[2]}\n`)
        let seed = args[2]
        seed = seed.toLowerCase()
        var dirname = path.dirname("santuy/seeds")
        if (fs.existsSync(`${dirname}/seeds/${seed}.json`)) {
            console.error(`error: Seed ${args[2]} exists!\n`)
            process.exit(0)
        }
        generateSeedfile(seed).then((data) => {
            fs.writeFileSync(`${dirname}/seeds/${seed}.json`, data, 'utf-8')
        })

        console.log(`${dirname}/seeds/${seed}.json`)
        console.log(`Seed ${args[2]} has been generated!\n`)
    } else {
        help()
    }

}

async function generateSeedfile(seed) {
    seed = seed.toLowerCase()
    let modelFile = `../../../../santuy/models/${seed}.js`
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        modelFile = `../../santuy/models/${seed}.js`
    }

    const model = require(modelFile)
    const columns = model.columns
    let seedCode = `
[
    {
    `
    let index = 0
    for (const col of columns) {
        col.name = col.name.toLowerCase()
        if (col.name != "id") {
            if (col.inputType == "number" || col.inputType == "checkbox") {
                seedCode += `
            "${col.name}":${genRandNum(100)}`
            } else {
                seedCode += `
            "${col.name}":"${genRandStr(10)}"`
            }
            if (index < columns.length - 1) {
                seedCode += `,`
            }

        }
        index++
    }
    seedCode += `
    }
]
    `

    return seedCode
}

const genRandStr = (len) => {
    return Math.random().toString(36).substring(2, len + 2)
}

const genRandNum = (len) => {
    return Math.floor(Math.random() * len) + 1
}

module.exports = { generateSeed }