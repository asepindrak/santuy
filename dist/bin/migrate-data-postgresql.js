const Database = require('./database.js')

async function migrateDataPg(models) {
    if (!models) {
        return false
    }

    const db = new Database()
    await db.executeQuery("START TRANSACTION")
    const newModels = Object.values(models)
    let model
    for await (model of newModels) {
        model.name = model.name.toLowerCase()

        let query = "CREATE TABLE IF NOT EXISTS " + model.name + " ( "


        let field
        for await (field of model.columns) {
            field.name = field.name.toLowerCase()
            let dataType = field.dataType
            dataType = dataType.replace("INT AUTO_INCREMENT", "serial")
            dataType = dataType.replace(/[^a-zA-Z\s]+/g, '')

            query += field.name + " " + dataType + ", "
        }
        query += "trash INT DEFAULT 0, "
        query += "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "
        query += "created_by TIMESTAMP DEFAULT NULL"
        let engine = ""
        query += " )  " + engine

        await db.executeQuery(query)
        //check if table exist
        const checkTable = await db.executeQuery(`SELECT EXISTS (SELECT FROM pg_tables WHERE  schemaname = '${db.database}' AND tablename = '${model.name}'
        ); `)
        if (checkTable) {
            //check if column exist
            let field
            for await (field of model.columns) {
                field.name = field.name.toLowerCase()

                const checkColumn = await db.executeQuery(`SELECT column_name FROM information_schema.columns WHERE table_name='${model.name}' and column_name='${field.name}';`)

                if (checkColumn.rowCount == 0) {
                    let dataType = field.dataType
                    dataType = dataType.replace("INT AUTO_INCREMENT", "serial")
                    dataType = dataType.replace(/[^a-zA-Z\s]+/g, '')
                    await db.executeQuery("ALTER TABLE " + model.name + " ADD " + field.name + " " + dataType + " ")
                    console.log(`Column: create column ${field.name} on ${model.name}`)
                }
                if (field.relation) {
                    if (field.relation.field) {
                        //check if index exist
                        let checkIndex = await db.executeQuery(`select * from pg_indexes where indexname = 'index_${model.name}_${field.name}'`)

                        if (checkIndex.rows.length == 0) {
                            let createIndex = await db.executeQuery(`CREATE INDEX index_${model.name}_${field.name} ON ${model.name} (${field.name});`)
                            if (createIndex) {
                                console.log(`Index: create index ${model.name} index_${model.name}_${field.name}`)
                            } else {
                                console.error(`error: Create index ${model.name} index_${model.name}_${field.name} failed!`)
                            }
                        }
                        if (field.relation.reference) {
                            let referenceArr = field.relation.reference.split(".")
                            if (referenceArr.length == 2) {
                                let referenceModel = referenceArr[0]
                                let referenceField = referenceArr[1]
                                let checkRef = await db.executeQuery(`SELECT COUNT(1) as count FROM information_schema.table_constraints WHERE constraint_name='fk_${model.name}_${field.name}' AND table_name='${model.name}';`)

                                if (checkRef.rows[0].count == 0) {
                                    let constraint = await db.executeQuery(`ALTER TABLE ${model.name}
                                        ADD CONSTRAINT fk_${model.name}_${field.name} FOREIGN KEY (${field.name}) REFERENCES ${referenceModel} (${referenceField}) ON DELETE CASCADE ON UPDATE CASCADE;`)
                                    if (constraint) {
                                        console.log(`Relation: create reference fk_${model.name}_${field.name}`)
                                    } else {
                                        console.error(`error: Relation create reference fk_${model.name}_${field.name} failed!`)
                                    }
                                }


                            } else {
                                console.error('error: reference not available!')
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

    await db.executeQuery("COMMIT")
    console.log("\n")
    console.log(`--------------------------------------\n\n`)
    console.log("MIGRATION SUCCESSFULLY\n")
    console.log(`--------------------------------------\n\n`)
    process.exit(0)
}

module.exports = { migrateDataPg }