import Database from './database.js'

async function migrateData(database, models) {
    if (!models) {
        return false
    }
    const db = new Database(database)
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

        //check if table exist
        const checkTable = await db.executeQuery("SELECT COUNT(TABLE_NAME) as count FROM  information_schema.TABLES  WHERE  TABLE_SCHEMA LIKE '" + database.database + "' AND  TABLE_TYPE LIKE 'BASE TABLE' AND TABLE_NAME = '" + model.name + "'")
        if (checkTable.length) {
            const countTable = checkTable[0].count
            if (countTable) {
                //check if column exist
                let field
                for await (field of model.columns) {

                    const checkColumn = await db.executeQuery("SHOW COLUMNS FROM " + model.name + " LIKE '" + field.name + "'")
                    if (!checkColumn.length) {
                        let dataType = field.dataType

                        await db.executeQuery("ALTER TABLE " + model.name + " ADD COLUMN " + field.name + " " + dataType + " ")
                    }
                }
            }
        }
        await db.executeQuery(query)
    }


    await db.executeQuery("COMMIT")
    console.log("\n")
    console.log(`--------------------------------------\n\n`)
    console.log("MIGRATION SUCCESSFULLY\n")
    console.log(`--------------------------------------\n\n`)
    process.exit(0)
}

export { migrateData }