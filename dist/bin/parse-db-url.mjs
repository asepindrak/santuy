export default function parseDb(dbUrl) {
    dbUrl = dbUrl.replace("mysql://", "")
    dbUrl = dbUrl.replace("@", ":")
    let dbArr = dbUrl.split(":")
    let user = dbArr[0]
    let password = dbArr[1]
    let host = dbArr[2]
    let portdb = dbArr[3]
    let portdbArr = portdb.split("/")
    let port = parseInt(portdbArr[0])
    let database = portdbArr[1]
    let db = {
        user,
        password,
        host,
        port,
        database
    }
    return db
}