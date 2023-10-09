import Database from "../config/database"

async function rollback() {
    const db = new Database()
    await db.executeQuery("ROLLBACK")
}

export { rollback }