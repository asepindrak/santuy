import Database from '../config/database'
import { QueryType } from '../types/type'

async function query({ database, query, params }: QueryType) {
    const db = new Database(database)
    if (!query) {
        return false
    }
    await db.executeQuery("START TRANSACTION",
        []
    )
    let result = await db.executeQuery(query, params)
    await db.executeQuery("COMMIT",
        []
    )
    return result
}

export { query }