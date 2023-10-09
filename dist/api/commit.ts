import Database from "../config/database"

Database

async function commit() {
    const db = new Database()
    await db.executeQuery("COMMIT")
}

export { commit }