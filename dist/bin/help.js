const { readFile } = require('fs/promises')
require("dotenv").config()
const version = process.env.npm_package_version


function help() {
    const command = [
        ["init", "Initiating Santuy"],
        ["push", "Generate database from model schema"],
        ["pull", "Generate model schema from database"],
        ["sync", "Database push & pull"],
        ["seed", "Database seeder"],
        ["generate", "Generate model or seed"],
    ]
    santuyLog()

    console.log('Command:')
    console.table(command)
    console.log('Usage:')
    console.log('npx santuy <command>')
    console.log('\n')
    console.log('npx santuy -h or --help')
    console.log('npx santuy -v or --version')
    console.log('npx santuy init')
    console.log('npx santuy generate model users')
    console.log('npx santuy sync')
    console.log('npx santuy push')
    console.log('npx santuy pull')
    console.log('npx santuy generate seed users')
    console.log('npx santuy seed users')
    process.exit(0)
}

function santuyLog() {

    console.log(`            Santuy ${version}          \n`)
    console.log(`--------------------------------------\n`)
    console.log(`**   coding while lying down   **\n`)
    console.log(`--------------------------------------\n\n`)

}

module.exports = { help, santuyLog }