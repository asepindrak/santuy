import Database from "../config/database"

async function start() {
    const db = new Database()
    await db.executeQuery("START TRANSACTION")
}

export { start }