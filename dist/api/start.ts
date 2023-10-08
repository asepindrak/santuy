import Database from '@santuyapi/config/database'

async function start() {
    const db = new Database()
    await db.executeQuery("START TRANSACTION")
}

export { start }