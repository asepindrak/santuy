import Database from '../config/database'
import { QueryType } from '../types/type'

async function query({ database, query, params }: QueryType) {
    const db = new Database(database)
    if (!query) {
        return false
    }
    let result = await db.executeQuery(query, params)
    return result
}

export { query }