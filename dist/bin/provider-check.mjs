export default function providerCheck(dbUrl) {
    let dbArr = dbUrl.split(":")
    let provider = dbArr[0]
    return provider
}