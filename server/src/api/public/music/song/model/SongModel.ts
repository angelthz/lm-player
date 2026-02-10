/* 
    Model Layer: Database connection and queries
*/

import Database from "better-sqlite3";
import { SqliteDB } from "../../../../../db/SqliteDB";
import { SongRow } from "../../../../../types/types";
import { MostPlayedSongRow, RecentSongRow } from "../services/SongValidations";

export class SongModel {

    private db: SqliteDB;

    constructor() {
        this.db = new SqliteDB()
    }

    /**
     * get all songs
     * @param limit 
     * @param offset 
     * @returns 
     */
    public async getAll(limit: number, offset: number): Promise<SongRow[]> {
        try {
            let stmt = this.db.prepare(`
                SELECT 
                    song_id, song_title,
                    album_id, album_name, 
                    artist_id, artist_name,
                    track_num,
                    duration,
                    collaborators,
                    release_year,
                    genres,
                    play_count,
                    is_favorite,
                    url,
                    cover,
                    lyrics
                FROM view_song_details WHERE song_id
                LIMIT (?)
                OFFSET (?)
            `);
            let res = stmt.all(limit, offset);
            return res as SongRow[];

        } catch (err) {
            if (err instanceof SqliteDB.SqliteError) {
                throw Error(err.message)
            }
            else
                throw err;
        }
    }

    /**
     * get song by ID
     * @param id 
     * @returns 
     */
    public async getById(id: number | bigint): Promise<SongRow | null> {
        try {
            let stmt = this.db.prepare(`
                SELECT * FROM view_song_details WHERE song_id = (?)
            `);
            let result = stmt.get(id);
            return result ? result as SongRow : null;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }


    public async addSongActivity(id: number | bigint): Promise<Database.RunResult> {
        try {
            let query = this.db.prepare(`
                INSERT INTO song_activity (play_date, song_id) VALUES (datetime('now','localtime'), ?) 
            `);

            let res = query.run(id);

            return res;

        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }


    public async getRecentPlayed(limit: number, offset: number): Promise<RecentSongRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT 
                DISTINCT
                    vs.song_id, vs.song_title,
                    vs.album_id, vs.album_name,
                    vs.artist_id, vs.artist_name,
                    vs.track_num,
                    vs.duration,
                    vs.release_year,
                    vs.collaborators,
                    vs.genres,
                    vs.play_count,
                    vs.url,
                    vs.cover,
                    vs.is_favorite,
                    max(sa.play_date) as latest_play_date
                FROM view_song_details as vs
                    INNER JOIN song_activity as sa on sa.song_id = vs.song_id
                
                GROUP BY vs.song_id
                ORDER BY sa.play_date DESC
                LIMIT 30
            `);

            // let res = query.all(limit, offset);
            let res = query.all();

            return res as RecentSongRow[];

        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }


    public async getMostPlayed(): Promise<MostPlayedSongRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT
                    song_id, song_title,
                    album_id, album_name, 
                    artist_id, artist_name,
                    track_num,
                    duration,
                    release_year,
                    collaborators,
                    genres,
                    play_count,
                    url,
                    cover
                FROM view_song_details WHERE play_count > 0
                ORDER BY play_count DESC
                LIMIT 30;
            `);

            // let res = query.all(limit, offset);
            let res = query.all();

            return res as MostPlayedSongRow[];

        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }

}