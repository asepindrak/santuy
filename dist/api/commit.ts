import Database from "@santuyapi/config/database"

async function commit() {
    const db = new Database()
    await db.executeQuery("COMMIT")
}

export { commit }