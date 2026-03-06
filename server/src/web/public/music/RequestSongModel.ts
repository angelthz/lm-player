import { SqliteDB } from "../../../db/SqliteDB";

export class RequestSongModel {
    private db: SqliteDB;
    constructor() {
        this.db = new SqliteDB(process.env.DB_PATH);
    }

    public async getSongPath(id: number | bigint, fileName: string): Promise<{ path: string } | null> {
        try {
            let stmt = this.db.prepare(`SELECT path FROM song WHERE id = (?) AND file_name = (?)`);
            return stmt.get(id, fileName) as { path: string } | null;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }
}