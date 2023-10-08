import Database from '../config/database.js'

async function commit() {
    const db = new Database()
    await db.executeQuery("COMMIT")
}

export { commit }