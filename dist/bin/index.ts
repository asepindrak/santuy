#! /usr/bin/env node
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('HELP');
    console.log('migration: npx santuy migrate path_to/models');
    console.log('db seed: npx santuy seed path_to/seeds/filename.json');
    process.exit(0);
}

console.log(args)


process.exit(0);