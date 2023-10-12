#! /usr/bin/env node
const { readFile } = require('fs/promises')

require("dotenv").config()
const version = process.env.npm_package_version
const { initCLI } = require('./init.js')
const { syncCLI } = require('./sync.js')
const { generateCLI } = require('./generate.js')
const { seedCLI } = require('./seed.js')
const { pullCLI } = require('./pull.js')
const { pushCLI } = require('./push.js')
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
    case "sync":
        santuyLog()
        syncCLI()
        break
    case "generate":
        santuyLog()
        generateCLI(args)
        break
    case "seed":
        santuyLog()
        seedCLI(args)
        break
    case "pull":
        santuyLog()
        pullCLI(args)
        break
    case "push":
        santuyLog()
        pushCLI(args)
        break
    default:
        help()
}
