import { SqliteDB } from "../../../../../db/SqliteDB";
import { SongRow } from "../../song/services/SongValidations";
import { GenreDTO } from "../services/GenresValidation";

export class GenreModel {
    private db: SqliteDB;

    constructor() {
        this.db = new SqliteDB(process.env.DB_PATH);
    }

    public async getGenres(): Promise<GenreDTO[]> {
        try {
            let stmt = this.db.prepare(`SELECT *FROM genre ORDER BY name`);
            let result = stmt.all();
            return result as GenreDTO[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw (err);
        }
    }

    /**
        * get all songs by genre (id)
        * @param id 
        * @param limit 
        * @param offset 
        * @returns 
        */
    public async getSongsByGenre(id: number, limit: number, offset: number): Promise<SongRow[]> {
        try {
            let stmt = this.db.prepare(`
                    SELECT *FROM view_song_details AS so 
                    INNER JOIN song_genres AS sg ON sg.song_id = so.song_id
                    INNER JOIN genre AS ge ON ge.id = sg.genre_id
                    WHERE ge.id = (?)
                    LIMIT (?)
                    OFFSET (?) 
                `);
            let result = stmt.all(id, limit, offset);
            return result as SongRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }
}