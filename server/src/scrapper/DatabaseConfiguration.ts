import path from "node:path";
import { SqliteDB } from "../db/SqliteDB";
import { OrderedAlbum, OrderedArtistExtended, ScrapedTrack } from "../types/types";
import { OrderedArtistWithDetails } from "../types/DzArtistDetails";


export class DatabaseInit {
    private db: SqliteDB;

    constructor() {
        this.db = new SqliteDB();
    }


    //genres [Rock, Pop, Alternative]
    addGenre(genre: string) {
        try {
            let stmt = this.db.prepare("INSERT INTO genre (name) values (?)");
            let result = stmt.run(genre);
            if (result)
                return result.lastInsertRowid;
            return undefined;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at addGenre (${genre}) `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    getGenreByName(genre: string) {
        try {
            let stmt = this.db.prepare("SELECT *FROM genre WHERE name=(?)");
            let result = stmt.get(genre) as { id: number, name: string };
            if (result)
                return result.id;
            else
                return result;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at getGenreByName `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    addArtist(artist: OrderedArtistWithDetails): number | bigint | undefined {
        try {
            let stmt = this.db.prepare("INSERT INTO artist (name, bio, x64,x128,x256,x512,x1200,x1800, created_at) values (?,?,?,?,?,?,?,?,date('now'))");
            let { x64, x128, x256, x512, x1200, x1800 } = artist.photo;
            let bio = artist.details.bio ? artist.details.bio.full : "";
            let result = stmt.run(artist.name, bio, x64, x128, x256, x512, x1200, x1800);
            if (result)
                return result.lastInsertRowid;
            return undefined;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at addArtist (${name}) `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    getArtistByName(name: string): number | bigint | undefined {
        try {
            let stmt = this.db.prepare("SELECT id, name FROM artist WHERE name LIKE (?)");
            let result = stmt.get(name) as { id: number | bigint, name: string };
            if (result)
                return result.id;
            else
                return result;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at getArtistByName `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    addAlbum(album: OrderedAlbum, artistId: number | bigint) {
        try {
            let stmt = this.db.prepare("INSERT INTO album (name, release_year, x64, x128, x256, x512, x1200, artist_id, created_at) values (?,?,?,?,?,?,?,?,date('now'))");
            // let covers = album.cover.urls.map(c => c.url);
            // let result = stmt.run(album.name, album.year, covers[0], covers[1], covers[2], covers[3], covers[4], artistId);
            let result = stmt.run(album.name, album.year, album.cover.x64, album.cover.x128, album.cover.x256, album.cover.x512, album.cover.x1200, artistId);
            return result ? result.lastInsertRowid : undefined;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at addArtist (${album.name}) `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    getAlbumByName(name: string, artistId: number | bigint): number | bigint | undefined {
        try {
            let stmt = this.db.prepare("SELECT id,name FROM album WHERE name=(?) AND artist_id = (?)");
            let result = stmt.get(name, artistId) as { id: number | bigint, name: string };
            return result ? result.id : undefined;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at getArtistByName `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    addSong(song: ScrapedTrack, albumId: number | bigint) {
        try {
            let stmt = this.db.prepare(`
                INSERT INTO song (
                    title, 
                    duration, 
                    track_num, 
                    has_collab, 
                    plain_lyrics, 
                    sync_lyrics,
                    path, 
                    file_name, 
                    album_id,
                    created_at
                )
                values (?,?,?,?,?,?,?,?,?,date('now'))
            `);
            let result = stmt.run(
                song.title,
                song.duration,
                song.trackNum,
                song.collaborators.length > 0 ? 1 : 0,
                song.plainLyrics,
                song.syncLyrics,
                song.path,
                song.fileName,
                albumId
            );

            return result.lastInsertRowid;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log("Error at: addSongs", err.message);
            else
                console.log(err);
        }
    }


    addSongGenre(songId: number | bigint, genreId: number | bigint) {
        try {
            let stmt = this.db.prepare(`
                INSERT INTO song_genres (song_id, genre_id)
                VALUES (?,?)
            `);
            let res = stmt.run(songId, genreId);
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log("Error at: addSongGenres: ", err.message);
            else
                console.log(err);
        }
    }

    addCollaboration(mainId: number | bigint, collaboratorId: number | bigint, songId: number | bigint) {
        try {
            let stmt = this.db.prepare(`
                INSERT INTO collaborations (main_id, collaborator_id, song_id)
                VALUES (?,?,?)
            `);
            let res = stmt.run(mainId, collaboratorId, songId);
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log("Error at: addCollaboration: ", err.message);
            else
                console.log(err);
        }
    }

    getSongByName(artistName: string, songTitle: number | bigint): number | bigint | undefined {
        try {
            let stmt = this.db.prepare("SELECT id,title FROM song WHERE title=(?) AND artist_id = (?)");
            // let result = stmt.get(name, artistId) as { id: number | bigint, name: string };
            // return result ? result.id : undefined;
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log(`Error at getArtistByName `, err.message);
            else
                console.log(err);
            return undefined;
        }
    }

    createProfile(userId: string, userName: string) {
        try {
            let stmt = this.db.prepare(`
                INSERT INTO profile (id, username, created_at) 
                VALUES (?, ?, date('now','localtime'))
            `);
            let res = stmt.run(userId, userName);
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log("Error at: addProfileSongs", err.message);
            else
                console.log(err);
        }
    }

    addProfileSongs(userId: string) {
        try {
            let query = this.db.prepare(`SELECT id, title FROM song`);
            let result = query.all() as { id: number | bigint, title: string }[];
            let stmt = this.db.prepare(`
                INSERT INTO profile_songs (id, added_at, is_favorite, song_id, profile_id) 
                VALUES (concat(?,CAST( (?) AS integer)), date('now','localtime'), 0, ?, ?)
            `);
            result.forEach(s => {
                stmt.run(userId, s.id, s.id, userId);
            })
        } catch (err) {
            if (err instanceof SqliteDB.SqliteError)
                console.log("Error at: addProfileSongs", err.message);
            else
                console.log(err);
        }
    }


    public closeDB() {
        this.db.close();
    }
}



