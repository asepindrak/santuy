#! /usr/bin/env node
import { readFile } from 'fs/promises'

const packageJson = JSON.parse(
    await readFile(
        new URL('../../package.json', import.meta.url)
    )
)
import { initCLI } from './init.mjs'
import { migrateCLI } from './migrate.mjs'
import { generateCLI } from './generate.mjs'
import { seedCLI } from './seed.mjs'
import { help, santuyLog } from './help.mjs'
console.log(`\n`)

const args = process.argv.slice(2)
if (args.length < 1) {
    help()
} else if (args.length < 2 && (args[0] == "--help" || args[0] == "-h")) {
    help()
} else if (args.length < 2 && (args[0] == "--version" || args[0] == "-v")) {
    console.log(`Santuy ${packageJson.version}\n`)
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
