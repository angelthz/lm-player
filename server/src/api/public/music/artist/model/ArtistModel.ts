import { SqliteDB } from "../../../../../db/SqliteDB";
import { AlbumDetailDTO, AlbumDetailRow, AlbumRow } from "../../album/services/AlbumValidations";
import { MostPlayedSongRow, RecentSongDTO, SongRow } from "../../song/services/SongValidations";
import { ArtistCollaborationAlbumsRow, ArtistDetailRow, ArtistRow } from "../services/ArtistValidations";

export class ArtistModel {
    private db: SqliteDB;

    constructor() {
        this.db = new SqliteDB(process.env.DB_PATH);
    }

    public async getAllArtists(limit: number, offset: number) {
        try {
            let stmt = this.db.prepare(`
                SELECT 
                    ar.id as artist_id, 
                    ar.name as artist_name,
                    ar.bio,
                    ar.is_favorite,
                    json_object(
                        'x64',ar.x64,
                        'x128',ar.x128,
                        'x256',ar.x256,
                        'x512',ar.x512,
                        'x1200',ar.x1200,
                        'x1800',ar.x1800
                    ) as photo,
                    count(DISTINCT al.name) as albums_count, 
                    count(al.name) as songs_count,
                    json_object(
                        'seconds',sum(so.duration),
                        'minutes',sum(so.duration)/60,
                        'hours',sum(so.duration)/3600
                    ) as artist_time_count
                FROM artist as ar
                LEFT JOIN album as al on al.artist_id = ar.id
                LEFT JOIN song as so on so.album_id = al.id
                GROUP BY ar.name
                ORDER BY ar.name, al.release_year, so.track_num
                LIMIT (?)
                OFFSET (?)    
            `);
            console.log("params-> ")

            console.log("limit-> ", limit)
            console.log("offset-> ", offset)
            let res = stmt.all(limit, offset);

            return res as ArtistRow[];

        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }

    public async getArtistById(id: number | bigint): Promise<ArtistDetailRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT * FROM view_artist_details WHERE artist_id = (?);
            `);
            let result = query.get(id);
            return result as ArtistDetailRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw (err);
            throw (err);
        }
    }

    public async getArtistAlbums(artistId: number): Promise<AlbumDetailRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT *FROM view_album_details WHERE artist_id = (?);
            `);

            let res = query.all(artistId);

            return res as AlbumDetailRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw (err);
            throw (err);
        }
    }

    public async getArtistSongs(artistId: number): Promise<SongRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT *FROM view_song_details WHERE artist_id = (?);
            `);
            return query.all(artistId) as SongRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }

    public async getRecentPlayed(artistId: number): Promise<RecentSongDTO[]> {
        try {
            let query = this.db.prepare(`
                SELECT 
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
                    max(sa.play_date) as latest_play_date
                FROM view_song_details as vs
                    INNER JOIN song_activity as sa on sa.song_id = vs.song_id
                WHERE vs.artist_id = (?)
                    GROUP BY vs.song_id
                    ORDER BY sa.play_date DESC
                LIMIT 30
            `);

            let res = query.all(artistId);

            return res as RecentSongDTO[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw (err);
            throw (err);
        }
    }

    public async getMostPlayed(artistId: number): Promise<MostPlayedSongRow[]> {
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
                FROM view_song_details WHERE play_count > 0 AND artist_id = (?)
                ORDER BY play_count DESC
                LIMIT 30
            `);

            let res = query.all(artistId);

            return res as MostPlayedSongRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw (err);
            throw (err);
        }
    }

    public async getAlbumsWithCollaborations(artistId: number | bigint): Promise<ArtistCollaborationAlbumsRow[]> {
        try {
            let query = this.db.prepare(`
                SELECT 
                DISTINCT
                    album_id, 
                    album_name,
                    release_year,
                    main_artist_id, 
                    main_artist_name, 
                    collaborators,
                    cover
                FROM view_artist_albums_collaborations WHERE collaborator_id = (?)
            `);
            let res = query.all(artistId);
            return res as ArtistCollaborationAlbumsRow[];
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                throw err.message;
            throw err;
        }
    }
}