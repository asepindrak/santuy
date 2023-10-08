import Database from '../config/database'
import { TransactionType } from '../types/type'

async function start({ database }: TransactionType) {
    const db = new Database(database)
    await db.executeQuery("START TRANSACTION")
}

export { start }