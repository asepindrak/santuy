
const fs = require('fs')
const path = require('path')
require("dotenv").config()
const { pullModelMysql } = require('./pull-model-mysql.js')
const { pullModelPg } = require('./pull-model-postgresql.js')
const providerCheck = require('./provider-check.js')

const pullCLI = async () => {
    console.log("DATABASE PULL\n")
    console.log(`--------------------------------------\n\n`)

    var dirname = path.dirname("santuy/models")
    if (!fs.existsSync(`${dirname}/schema.js`)) {
        //schema not exists
        console.error('Schema not exist\n\n')
        console.log("init santuy first\n\n")
        console.log("command:\n")
        console.log('npx santuy init')
        process.exit(0)
    }
    let SANTUY_ENV = process.env.SANTUY_ENV
    let dbUrl = process.env.DATABASE_URL
    let provider = providerCheck(dbUrl)

    if (SANTUY_ENV == "development") {
        const { models } = require(`../../santuy/schema.js`)
        if (provider == "mysql") {
            pullModelMysql(models)
        } else if (provider == "postgresql") {
            pullModelPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    } else {
        const { models } = require(`../../../../santuy/schema.js`)
        if (provider == "mysql") {
            pullModelMysql(models)
        } else if (provider == "postgresql") {
            pullModelPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    }

}

module.exports = { pullCLI }