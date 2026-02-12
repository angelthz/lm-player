import { SqliteDB } from "../../../../../db/SqliteDB";
import { SongRow } from "../../song/services/SongValidations";
import { AlbumDetailRow, AlbumRow } from "../services/AlbumValidations";

export class AlbumModel {
    private db: SqliteDB;

    constructor() {
        this.db = new SqliteDB(process.env.DB_PATH);
    }

    public async getAllAlbums(limit: number, offset: number): Promise<AlbumRow[]> {
        try {
            let stmt = this.db.prepare(`
                SELECT 
                    ar.id as artist_id,
                    ar.name as artist_name, 
                    al.id as album_id,
                    al.name as album_name, 
                    al.release_year, 
                    count(al.name) as songs_count, 
                    json_object(
                        'seconds',sum(s.duration),
                        'minutes',sum(s.duration)/60, 
                        'hours',sum(s.duration)/3600
                    ) as duration,
                    json_object(
                    'x64',al.x64,
                    'x128', al.x128,
                    'x256', al.x256,
                    'x512', al.x512,
                    'x1200', al.x1200  
                    ) as cover
                FROM album AS al
                    INNER JOIN song AS s ON s.album_id = al.id
                    INNER JOIN artist AS ar ON al.artist_id = ar.id
                GROUP BY al.name
                ORDER BY ar.name, al.release_year
                LIMIT (?)
                OFFSET (?)  
            `);

            return stmt.all(limit, offset) as AlbumRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }

    public async getAlbumById(albumId: number): Promise<AlbumDetailRow | null> {
        try {
            let query = this.db.prepare(`
               SELECT * FROM view_album_details WHERE album_id = (?);
            `);
            let res = query.get(albumId);

            return res as AlbumDetailRow;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }

    public async getAlbumSongs(id: number | bigint) {
        try {
            let stmt = this.db.prepare(`
                SELECT *FROM view_song_details WHERE album_id = (?)
            `);
            return stmt.all(id) as SongRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }
}