import Database from '../config/database.js'
import { TransactionType } from '../types/type'

async function rollback({ database }: TransactionType) {
    const db = new Database(database)
    await db.executeQuery("ROLLBACK")
}

export { rollback }