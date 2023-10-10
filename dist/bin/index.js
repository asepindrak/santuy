#! /usr/bin/env node
const { readFile } = require('fs/promises')

require("dotenv").config()
const version = process.env.npm_package_version
const { initCLI } = require('./init.js')
const { migrateCLI } = require('./migrate.js')
const { generateCLI } = require('./generate.js')
const { seedCLI } = require('./seed.js')
const { help, santuyLog } = require('./help.js')
console.log(`\n`)

const args = process.argv.slice(2)
if (args.length < 1) {
    help()
} else if (args.length < 2 && (args[0] == "--help" || args[0] == "-h")) {
    help()
} else if (args.length < 2 && (args[0] == "--version" || args[0] == "-v")) {
    console.log(`Santuy ${version}\n`)
    process.exit(0)
}

switch (args[0]) {
    case "init":
        santuyLog()
        initCLI()
        break
    case "migrate":
        santuyLog()
        migrateCLI()
        break
    case "generate":
        santuyLog()
        generateCLI(args)
        break
    case "seed":
        santuyLog()
        seedCLI(args)
        break
    default:
        help()
}
