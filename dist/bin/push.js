
const fs = require('fs')
const path = require('path')
require("dotenv").config()
const { pushModelMysql } = require('./push-model-mysql.js')
const { pushModelPg } = require('./push-model-postgresql.js')
const providerCheck = require('./provider-check.js')

const pushCLI = async () => {
    console.log("DATABASE PUSH\n")
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
            pushModelMysql(models)
        } else if (provider == "postgresql") {
            pushModelPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    } else {
        const { models } = require(`../../../../santuy/schema.js`)
        if (provider == "mysql") {
            pushModelMysql(models)
        } else if (provider == "postgresql") {
            pushModelPg(models)
        } else {
            console.error('SQL provider error\n\n')
            console.log("env file:\n")
            console.log('provider: postgresql / mysql')
            process.exit(0)
        }
    }

}

module.exports = { pushCLI }