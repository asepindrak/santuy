const PriceFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

import { DatabaseType } from '../types/type'

const parseDb = (provider: string, dbUrl: string) => {
    dbUrl = dbUrl.replace(`${provider}://`, "")
    dbUrl = dbUrl.replace("@", ":")
    let dbArr = dbUrl.split(":")
    let user = dbArr[0]
    let password = dbArr[1]
    let host = dbArr[2]
    let portdb = dbArr[3]
    let portdbArr = portdb.split("/")
    let port = parseInt(portdbArr[0])
    let db = portdbArr[1]
    let database: DatabaseType = {
        user,
        password,
        host,
        port,
        database: db
    }
    return database
}

const providerCheck = (dbUrl: string) => {
    let dbArr = dbUrl.split(":")
    let provider = dbArr[0]
    return provider
}

export { PriceFormat, parseDb, providerCheck }