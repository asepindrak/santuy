import 'dotenv/config';
declare class Database {
    private host;
    private user;
    private password;
    private port;
    private database;
    private pool;
    constructor();
    executeQuery: (query: any) => Promise<unknown>;
}
export default Database;
