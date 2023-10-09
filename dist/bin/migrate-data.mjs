import Database from './database.mjs'

async function migrateData(models) {
    if (!models) {
        return false
    }
    const db = new Database()
    await db.executeQuery("START TRANSACTION")
    const newModels = Object.values(models)
    let model
    for await (model of newModels) {

        let query = "CREATE TABLE IF NOT EXISTS " + model.name + " ( "


        let field
        for await (field of model.columns) {
            let dataType = field.dataType
            query += field.name + " " + dataType + ", "
        }
        query += "trash INT DEFAULT 0, "
        query += "createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        query += "createdBy TIMESTAMP DEFAULT NULL"
        query += " )  ENGINE=INNODB"

        await db.executeQuery(query)
        //check if table exist
        const checkTable = await db.executeQuery("SELECT COUNT(TABLE_NAME) as count FROM  information_schema.TABLES  WHERE  TABLE_SCHEMA LIKE '" + db.database + "' AND  TABLE_TYPE LIKE 'BASE TABLE' AND TABLE_NAME = '" + model.name + "'")
        if (checkTable.length) {
            const countTable = checkTable[0].count
            if (countTable) {
                //check if column exist
                let field
                for await (field of model.columns) {

                    const checkColumn = await db.executeQuery("SHOW COLUMNS FROM " + model.name + " LIKE '" + field.name + "'")
                    if (!checkColumn.length) {
                        let dataType = field.dataType
                        console.log("ALTER TABLE " + model.name + " ADD COLUMN " + field.name + " " + dataType + " ")
                        await db.executeQuery("ALTER TABLE " + model.name + " ADD COLUMN " + field.name + " " + dataType + " ")
                    } else {
                        if (field.relation) {
                            if (field.relation.field) {
                                //check if index exist
                                let checkIndex = await db.executeQuery(`show index from ${model.name} where Column_name='${field.name}';`)
                                if (!checkIndex.length) {
                                    console.log(`Relation: create reference index_${field.name}`)
                                    await db.executeQuery(`CREATE INDEX index_${field.name} ON ${model.name} (${field.name});`)
                                }

                                if (field.relation.reference) {
                                    let checkRef = await db.executeQuery(`SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME='FK_${model.name}_${field.name}'  `)
                                    if (!checkRef.length) {
                                        console.log(`Relation: create reference FK_${model.name}_${field.name}`)
                                        let referenceArr = field.relation.reference.split(".")
                                        if (referenceArr.length == 2) {
                                            let referenceModel = referenceArr[0]
                                            let referenceField = referenceArr[1]
                                            let constraint = await db.executeQuery(`ALTER TABLE ${model.name}
                                            ADD CONSTRAINT FK_${model.name}_${field.name} FOREIGN KEY (${field.name}) REFERENCES ${referenceModel} (${referenceField}) ON DELETE CASCADE ON UPDATE CASCADE;`)
                                            if (constraint) {
                                                console.log(`relation FK_${model.name}_${field.name} has been added!`)
                                            } else {
                                                console.error(`error: relation FK_${model.name}_${field.name} failed!`)
                                            }
                                        } else {
                                            console.error('error: reference not available!')
                                        }
                                    }


                                } else {
                                    console.error('error: relation sets, but reference not exists!')
                                }

                            } else {
                                console.error('error: relation sets, but field not exists!')
                            }
                        }
                    }
                }
            }
        }
    }

    await db.executeQuery("COMMIT")
    console.log("\n")
    console.log(`--------------------------------------\n\n`)
    console.log("MIGRATION SUCCESSFULLY\n")
    console.log(`--------------------------------------\n\n`)
    process.exit(0)
}

export { migrateData }