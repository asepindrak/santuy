import Database from '../config/database'
import { GetType } from '../types/type'

async function get({ model, database }: GetType) {
    const db = new Database(database)
    if (!model) {
        return false
    }
    await db.executeQuery("START TRANSACTION",
        []
    )
    let result = await db.executeQuery(`SELECT * FROM ${model} where trash = 0 order by id desc`,
        []
    )
    await db.executeQuery("COMMIT",
        []
    )
    return result
}

export { get }