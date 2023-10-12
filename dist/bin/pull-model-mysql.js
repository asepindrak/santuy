const fs = require('fs')
const path = require('path')
require("dotenv").config()

const Database = require('./database.js')

async function pullModelMysql(models) {
    if (!models) {
        return false
    }
    let SANTUY_ENV = process.env.SANTUY_ENV

    const db = new Database()
    await db.executeQuery("START TRANSACTION")
    const newModels = Object.values(models)


    //check if table exist
    const checkTable = await db.executeQuery("SELECT TABLE_NAME FROM  information_schema.TABLES  WHERE  TABLE_SCHEMA LIKE '" + db.database + "' AND  TABLE_TYPE LIKE 'BASE TABLE'")

    if (checkTable.length) {
        for await (const item of checkTable) {

            let table = item.TABLE_NAME

            if (!newModels[table]) {
                var dirname = path.dirname("santuy/models")
                if (fs.existsSync(`${dirname}/models/${table}.js`)) {
                    //case if model already exists
                    console.error(`error: Model ${table} exists! remove first\n`)
                } else {
                    //case if model doesn't exists
                    await fs.writeFileSync(`${dirname}/models/${table}.js`, generateModelfile(table), 'utf-8')
                    generateModelsfile(table).then(async (data) => {
                        await fs.writeFileSync(`${dirname}/schema.js`, data, 'utf-8')

                        console.log(`${dirname}/models/${table}.js`)
                        console.log(`${dirname}/schema.js`)
                        console.log(`Model ${table} has been generated!\n`)

                        let modelSchemaPath = `../../../../santuy/models/${table}.js`
                        if (SANTUY_ENV == "development") {
                            modelSchemaPath = `../../santuy/models/${table}.js`
                        }
                        modelSchema = require(modelSchemaPath)
                        let columnsSchema = modelSchema.columns
                        const checkColumn = await db.executeQuery("SHOW COLUMNS FROM " + table + " ")
                        console.log(checkColumn)
                        if (checkColumn.length) {
                            for await (const col of checkColumn) {
                                let name = col.Field
                                let upperField = name.toUpperCase()
                                let title = capitalizeFirstLetter(name)
                                let ai = ''
                                let isNull = ''
                                let primary = ''
                                let inputType = ''
                                if (col.Key == "PRI") {
                                    primary = "PRIMARY KEY"
                                }
                                if (col.Extra == "auto_increment") {
                                    ai = 'AUTO_INCREMENT'
                                } else {
                                    if (col.Null == "YES" || col.Default === null) {
                                        isNull = "NULL"
                                    }
                                }
                                if (col.Type == "int" || col.Type == "float" || col.Type == "double" || col.Type == "decimal") {
                                    inputType = 'number'
                                } else if (col.Type == "date") {
                                    inputType = 'date'
                                } else if (col.Type == "datetime") {
                                    inputType = 'datetime'
                                } else if (col.Type == "timestamp") {
                                    inputType = 'datetime'
                                } else if (col.Type == "enum") {
                                    inputType = 'select'
                                } else {
                                    inputType = 'text'
                                }
                                let addCol = {
                                    name,
                                    title,
                                    dataType: `${upperField} ${isNull} ${ai} ${primary}`,
                                    inputType
                                }
                                columnsSchema.push(addCol)
                            }
                            modelSchema.columns = columnsSchema

                            let modelSchemaStr = modelSchema.toString()
                            console.log(modelSchemaStr)
                        }


                    })
                }
            }

        }

    }

    // if (checkTable.length) {
    //     const countTable = checkTable[0].count
    //     if (countTable) {
    //         //check if column exist
    //         let field
    //         for await (field of model.columns) {
    //             field.name = field.name.toLowerCase()

    //             const checkColumn = await db.executeQuery("SHOW COLUMNS FROM " + model.name + " LIKE '" + field.name + "'")
    //             if (!checkColumn.length) {
    //                 let dataType = field.dataType
    //                 await db.executeQuery("ALTER TABLE " + model.name + " ADD COLUMN " + field.name + " " + dataType + " ")
    //                 console.log(`Column: create column ${field.name} on ${model.name}`)
    //             }
    //             if (field.relation) {
    //                 if (field.relation.field) {
    //                     //check if index exist
    //                     let checkIndex = await db.executeQuery(`show index from ${model.name} where Column_name='${field.name}';`)
    //                     if (!checkIndex.length) {
    //                         let createIndex = await db.executeQuery(`CREATE INDEX index_${model.name}_${field.name} ON ${model.name} (${field.name});`)
    //                         if (createIndex) {
    //                             console.log(`Index: create index ${model.name} index_${model.name}_${field.name}`)
    //                         } else {
    //                             console.error(`error: Create index ${model.name} index_${model.name}_${field.name} failed!`)
    //                         }
    //                     }
    //                     if (field.relation.reference) {
    //                         let referenceArr = field.relation.reference.split(".")
    //                         if (referenceArr.length == 2) {
    //                             let referenceModel = referenceArr[0]
    //                             let referenceField = referenceArr[1]
    //                             let checkRef = await db.executeQuery(`SELECT *
    //                                 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    //                                 WHERE REFERENCED_TABLE_NAME = '${referenceModel}' AND TABLE_NAME = '${model.name}' AND TABLE_SCHEMA = '${db.database}' AND CONSTRAINT_NAME = 'fk_${model.name}_${field.name}'  `)

    //                             if (!checkRef.length) {
    //                                 let constraint = await db.executeQuery(`ALTER TABLE ${model.name}
    //                                     ADD CONSTRAINT fk_${model.name}_${field.name} FOREIGN KEY (${field.name}) REFERENCES ${referenceModel} (${referenceField}) ON DELETE CASCADE ON UPDATE CASCADE;`)
    //                                 if (constraint) {
    //                                     console.log(`Relation: create reference fk_${model.name}_${field.name}`)
    //                                 } else {
    //                                     console.error(`error: Relation create reference fk_${model.name}_${field.name} failed!`)
    //                                 }
    //                             }


    //                         } else {
    //                             console.error('error: reference not available!')
    //                         }



    //                     } else {
    //                         console.error('error: relation sets, but reference not exists!')
    //                     }

    //                 } else {
    //                     console.error('error: relation sets, but field not exists!')
    //                 }
    //             }
    //         }
    //     }
    // }


    await db.executeQuery("COMMIT")
    console.log("\n")
    console.log(`--------------------------------------\n\n`)
    console.log("PULL SUCCESSFULLY\n")
    console.log(`--------------------------------------\n\n`)
    process.exit(0)
}


function generateModelfile(model) {
    model = model.toLowerCase()
    const capModel = capitalizeFirstLetter(model)
    const modelCode = `
        const ${capModel}Model = {
            name: '${model}',
            icon: 'AiFillCaretRight',
            columns: [
                {
                    name: 'id',
                    title: 'ID',
                    dataType: 'INT AUTO_INCREMENT PRIMARY KEY',
                    inputType: 'number',
                },
            ],
        }


        module.exports = ${capModel}Model
    `

    return modelCode
}

async function generateModelsfile(model) {
    let jsFile = "../../../../santuy/schema.js"
    let SANTUY_ENV = process.env.SANTUY_ENV
    if (SANTUY_ENV == "development") {
        jsFile = "../../santuy/schema.js"
    }
    const { models } = require(jsFile)
    const capModel = capitalizeFirstLetter(model)
    let importModels = ""
    let allModels = Object.keys(models)
    let allModelsStr = ""
    for (const item of allModels) {
        let capItem = capitalizeFirstLetter(item)
        importModels += `const ${capItem}Model = require("./models/${item}.js") \n`
        allModelsStr += `
        ${item}:${capItem}Model,
        `
    }
    importModels += `const ${capModel}Model = require("./models/${model}.js") \n`
    allModelsStr += `
        ${model}:${capModel}Model,
        `

    const modelsCode = `
        ${importModels}

        const models = {
            ${allModelsStr}
        }


        module.exports = { models }
    `
    return modelsCode
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = { pullModelMysql }