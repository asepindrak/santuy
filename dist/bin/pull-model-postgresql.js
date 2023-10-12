const Database = require('./database.js')

async function pullModelPg(models) {
    if (!models) {
        return false
    }

    const db = new Database()
    await db.executeQuery("START TRANSACTION")
    const newModels = Object.values(models)


    //check if table exist
    const checkTable = await db.executeQuery("SELECT TABLE_NAME FROM  information_schema.TABLES  WHERE  TABLE_SCHEMA LIKE '" + db.database + "' AND  TABLE_TYPE LIKE 'BASE TABLE'")

    if (checkTable.length) {
        for await (const item of checkTable) {
            let table = item.TABLE_NAME
            console.log(table)
            const checkColumn = await db.executeQuery("SHOW COLUMNS FROM " + table + " ")
            console.log(checkColumn)
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

module.exports = { pullModelPg }