const { readFile } = require('fs/promises')
require("dotenv").config()
const version = process.env.npm_package_version


function help() {
    const command = [
        ["init", "Generate santuy directory"],
        ["migrate", "Database migration & sync"],
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
    console.log('npx santuy migrate')
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