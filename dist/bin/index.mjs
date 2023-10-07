#! /usr/bin/env node
import packageJson from '../../package.json' assert {type: "json"}
import { initCLI } from './init.mjs'
import { migrateCLI } from './migrate.mjs'
import { seedCLI } from './seed.mjs'
console.log(`\n`)
console.log(`            Santuy ${packageJson.version}          \n`)
console.log(`--------------------------------------\n`)
console.log(`**   coding while lying down   **\n`)
console.log(`--------------------------------------\n\n`)



const args = process.argv.slice(2)
if (args.length < 1) {
    console.log('npx santuy <command>')
    console.log('')
    console.log('Usage:')
    console.log('')
    console.log('db migrate: npx santuy migrate path_to/models')
    console.log('db seed: npx santuy seed path_to/seeds/filename.json')
    process.exit(0)
}

switch (args[0]) {
    case "init":
        initCLI()
        break
    case "migrate":
        migrateCLI()
        break
    case "seed":
        seedCLI()
        break
    default:
        console.log("command error.")
}