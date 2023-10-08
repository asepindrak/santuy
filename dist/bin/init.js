import fs from 'fs'
import path from 'path'

const initCLI = () => {
    console.log("INIT\n")
    console.log(`--------------------------------------\n\n`)

    let check = ensureDirectoryExistence()
    if (check) {
        console.log("Folder santuy exists. Remove first, please!")
        process.exit(0)
    }
    createModel()
    console.log("Santuy has been initialized!")
    process.exit(0)
}

function ensureDirectoryExistence() {
    var dirname = path.dirname("santuy/model");
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname);

    var dirname2 = path.dirname("santuy/models/models");
    fs.mkdirSync(dirname2);
}

const models = `
import { UserModel } from "./models/user-model.js";

//define all models
const models = {
    'users': UserModel,
}
export { models }
`

const userModel = `
const UserModel = {
    name: 'users',
    icon: 'AiOutlineUser',
    columns: [
        {
            name: 'id',
            title: 'ID',
            dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
            inputType: 'number',
        },
        {
            name: 'username',
            title: 'Username',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'text',
        },
        {
            name: 'password',
            title: 'Password',
            dataType: 'VARCHAR(255) NULL',
            inputType: 'password',
        },
        {
            name: 'name',
            title: 'Name',
            dataType: 'VARCHAR(30) NULL',
            inputType: 'text',
        },
        {
            name: 'avatar',
            title: 'Avatar',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'image',
        },
        {
            name: 'address',
            title: 'Address',
            dataType: 'VARCHAR(100) NULL',
            inputType: 'textarea',
        },
    ],
};


export { UserModel }
`


async function createModel() {
    var dirname = path.dirname("santuy/models");

    fs.writeFileSync(`${dirname}/schema.js`, models, 'utf-8')
    console.log(`${dirname}/schema.js`)

    fs.writeFileSync(`${dirname}/models/user-model.js`, userModel, 'utf-8')
    console.log(`${dirname}/models/user-model.js`)
}

export { initCLI }