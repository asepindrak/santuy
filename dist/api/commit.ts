import Database from '../config/database.js'
import { TransactionType } from '../types/type'

async function commit({ database }: TransactionType) {
    const db = new Database(database)
    await db.executeQuery("COMMIT")
}

export { commit }