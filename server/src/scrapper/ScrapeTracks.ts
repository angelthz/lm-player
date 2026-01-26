import fs from "fs";
import { IAudioMetadata, ICommonTagsResult, IPicture, parseFile } from "music-metadata";
import cliProgress, { SingleBar } from "cli-progress";

import { FormatText, Formmatter } from "../utils/FormatText";
import { DatabaseInit } from "./DatabaseConfiguration";
import { Cover, ExtendedCover, OrderedArtist, ScrapedTrack } from "../types/types";
import { Time } from "../utils/Time";

import { DzScrapper } from "./DzScrapper";
import { OrderedArtistWithDetails } from "../types/DzArtistDetails";
import { ScrapeCover } from "./ScrapeCover";


// title, artists, collaborators, albumm , genre ,trackNum, year, sync lyrics, plain lyrics, duration, cover art buffer
// ['TIT2', 'TPE2', 'TPE1', 'TALB', 'TCON', 'TRCK', 'TYER', 'SYLT', 'USLT', 'TLEN', "APIC"],


async function scrapeTracksMetadata(dir: string): Promise<ScrapedTrack[]> {
    try {
        const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
        let start = Date.now();
        let ext = ".mp3"
        const files = fs.readdirSync(dir, { recursive: true });

        // const res: IAudioMetadata[] = [];
        const res: ScrapedTrack[] = [];

        if (files.length === 0) throw new Error("Error Reading the provided directory");

        console.log("Reading Tracks Metadata");

        let fileCounter = files.filter(f => f.includes(ext)).length;
        progressBar.start(fileCounter, 0);

        for (let file of files) {
            if (file.includes(ext)) {
                let path = dir + "\\" + file;
                let parsedSong = await parseFile(path)
                let artists = parsedSong.common.artist ? parsedSong.common.artist.split(" & ") : ["Unknown"];

                artists.forEach(artistName => res.push(scrapeTrack(artistName, path, parsedSong)))


                progressBar.increment(1);
            }
        }
        let end = Date.now();
        progressBar.stop();
        console.log(`Reading ${fileCounter} files in: ${((end - start) / 1000)} secs.`)
        console.log()
        return res;
    } catch (err) {
        console.log("Error:", err);
        return [];
    }
};

function scrapeTrack(currentArtist: string, path: string, song: IAudioMetadata): ScrapedTrack {

    // let artist = FormatText.removeLateralWhiteSpaces(artistParam)
    let artists = song.common.artist?.split(" & ") || ["Unknown"];
    // let artist = artists ? artists[0] : "Unknown";
    let collaborators = artists.filter(a => a !== currentArtist);
    // let collaborators = artists;
    // let artist = song.common.artist?.split(" & ")[0] || "Unknown";
    let title = song.common.title || "Unknown";
    let album = song.common.album || "Unknown";
    let num = song.common.track && song.common.track.no ? song.common.track.no : 0;
    let dur = song.format.duration ? song.format.duration : 0;
    let plainLyrics = "";
    let syncLyrics = "";
    let genres = song.common.genre ? song.common.genre.map(genre => genre.split(" & ")).flat() : ["Unknown"];
    let cover: {
        format: string;
        type?: string;
        description?: string;
        data: Uint8Array;
    } | null = null;
    let role: string = currentArtist === artists[0] ? "main" : "collab";
    let fileName = FormatText.formatFileName(song.common.title || "Unknown").toLocaleLowerCase() + ".mp3"
    let releaseYear = song.common.year || 0;
    // let mainArtist = collaborators

    // console.log(song.common.artist?.split("&"))
    // console.log(song.common.artist ? song.common.artist.split("&") : ["Unknown"])


    if (song.common.lyrics && song.common.lyrics[0])
        plainLyrics = song.common.lyrics[0].text || "";

    if (song.common.lyrics && song.common.lyrics[1] && song.common.lyrics[1].syncText)
        syncLyrics = song.common.lyrics[1].syncText.map(ly => `[${Time.toFullTMS(ly.timestamp! / 1000)}] ${ly.text}`).join("\n");

    // if (song.common.albumartist && song.common.artist)
    //     collaborator = song.common.albumartist !== song.common.artist ? song.common.artist : "";

    if (song.common.picture && song.common.picture[0])
        cover = song.common.picture[0];

    // if (song.common.albumartist)
    //     role = artist ? "main" : "collab";


    return {
        artist: currentArtist,
        album,
        title,
        trackNum: num,
        duration: dur,
        collaborators,
        genres,
        plainLyrics,
        syncLyrics,
        cover,
        releaseYear,
        role,
        fileName,
        path
    }
}

async function orderTracksByArtist(songs: ScrapedTrack[]) {
    const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
    let artistList = Array.from(new Set(songs.map(s => s.artist)));
    let filteredTracks: OrderedArtist[] = [];
    let start = Date.now();

    console.log("Filtering songs by artists");
    // progressBar.start(songs.length, 0);

    artistList.forEach(artistName => {
        let artistSongs = songs.filter(song => song.artist === artistName);
        let orderedAlbums = Array.from(new Set(artistSongs.map(s => s.album))).map(albumName => ({
            name: albumName,
            cover: getCoverMeta(artistName, albumName),
            year: artistSongs.filter(s => s.album === albumName).find(s => s.releaseYear)?.releaseYear || 0,
            songs: artistSongs.filter(s => s.album === albumName),
            isCollab: artistSongs.filter(s => s.album === albumName && s.role === "collab").length > 0 ? true : false
        }));
        filteredTracks.push({
            name: artistName,
            photo: getPhotoMeta(artistName),
            albums: orderedAlbums
        })
        progressBar.increment(1);
    })
    let end = Date.now();
    progressBar.stop();
    console.log(`Filtering ${songs.length} songs in: ${((end - start) / 1000)} secs.`)
    console.log()
    return filteredTracks;
}


function getCoverMeta(artistName: string, albumName: string): Cover {
    let artist = new Formmatter(artistName).toDirectoryName();
    let album = new Formmatter(albumName).toDirectoryName();
    const sizes = [64, 128, 256, 512, 1200];

    let temp = Object.fromEntries(
        sizes.map(size => [`x${size}`, `thumbnails/artist/${artist || "unknown"}/${album || "unknown"}/cover-${size}.jpg`]
        )) as { x64: string, x128: string, x256: string, x512: string, x1200: string };
    // let ob = Object.fromEntries(temp) as { x64: string, x128: string, x256: string, x512: string, x1200: string };

    return temp;
}

function getPhotoMeta(artistName: string): ExtendedCover {
    let artist = new Formmatter(artistName).toDirectoryName();
    const sizes = [64, 128, 256, 512, 1200, 1800];

    let temp = Object.fromEntries(
        sizes.map(size => [`x${size}`, `thumbnails/artist/${artist || "unknown"}/photo-${size}.jpg`]
        )) as { x64: string, x128: string, x256: string, x512: string, x1200: string, x1800: string };
    // let ob = Object.fromEntries(temp) as { x64: string, x128: string, x256: string, x512: string, x1200: string };

    return temp;
}


async function scrapeAlbumCovers(orderedTracks: OrderedArtist[]) {
    const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
    let start = Date.now();
    let { albumsCount } = tracksLenght(orderedTracks);

    //write covers
    console.log("Scrapping Albums Thumbnails");
    progressBar.start(albumsCount, 0);

    for (let artist of orderedTracks) {
        for (let album of artist.albums) {
            let selectedSong = album.songs.find(song => song.cover);
            if (selectedSong && selectedSong.cover && selectedSong.cover.data)
                await ScrapeCover.saveFromBuffer(selectedSong.cover.data, artist.name, album.name);
            else
                await ScrapeCover.saveFromBuffer(null, artist.name, album.name);
            progressBar.increment(1);
        }
    }
    progressBar.stop();
    console.log(`Scraped ${albumsCount} Albums thumbails in: ${((Date.now() - start) / 1000)} secs.`)
    console.log();
}

function tracksLenght(ordered: OrderedArtist[] | OrderedArtistWithDetails[]) {
    let artists = ordered.length;
    let albums = ordered.map(artist => artist.albums.length).reduce((prev, curr) => prev + curr, 0);
    let songs = ordered.map(ar => ar.albums.map(al => !al.isCollab ? al.songs.length : 0).reduce((prev, curr) => prev + curr, 0)).reduce((prev, curr) => prev + curr, 0)
    return {
        artistsCount: artists,
        albumsCount: albums,
        songsCount: songs
    }
}

function getGenres(ordered: OrderedArtist[] | OrderedArtistWithDetails[]) {
    let genres: string[] = [];
    ordered.forEach(ar => ar.albums.forEach(al => al.songs.forEach(s => genres.push(...s.genres))))
    return Array.from(new Set(genres));
}

async function saveToDatabase(filteredSongs: OrderedArtistWithDetails[]) {
    const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
    const db = new DatabaseInit();
    let genres = getGenres(filteredSongs);
    let { songsCount } = tracksLenght(filteredSongs);
    let start = Date.now();

    console.log("Updating Database");
    progressBar.start(songsCount, 0);

    genres.forEach(g => db.addGenre(g));

    // progressBar.start(songsCount, 0)

    filteredSongs.forEach(artist => {
        //check if artist exists in DB
        let artistId = db.getArtistByName(artist.name) || db.addArtist(artist);

        artist.albums.forEach(album => {
            //check if album exists in DB

            if (album.isCollab) return;
            let albumId = db.getAlbumByName(album.name, artistId!) || db.addAlbum(album, artistId!);
            // console.log(artist.name, album.name, album.isCollab)

            album.songs.forEach(song => {
                let songId = db.addSong(song, albumId!);
                song.genres.forEach(g => {
                    let genreId = db.getGenreByName(g);
                    db.addSongGenre(songId!, genreId!)
                })
                song.collaborators.forEach(c => {
                    let collaboratorId = db.getArtistByName(c) || db.addArtist(filteredSongs.find(a => a.name === c)!);
                    db.addCollaboration(artistId!, collaboratorId!, songId!);
                })
                progressBar.increment(1);
            })

        })
    })


    let end = Date.now();
    progressBar.stop();
    console.log(`${songsCount} rows added to Database: ${((end - start) / 1000)} secs.`)
    console.log();

    db.closeDB();
}

async function scrapeArtistList(artists: OrderedArtist[]): Promise<OrderedArtistWithDetails[]> {
    const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
    let { artistsCount } = tracksLenght(artists);
    let scrapedList: OrderedArtistWithDetails[] = [];
    let dzScrapper = new DzScrapper();
    let start = Date.now();

    console.log("Scrapping Artist Meta");
    progressBar.start(artistsCount, 0);

    for (let artist of artists) {

        let artistResponse = await dzScrapper.getArtist(artist.name);

        if (artistResponse) {
            let artistDetails = await dzScrapper.getArtistDetails(artistResponse.id);
            if (artistDetails)
                scrapedList.push({
                    ...artist, details: {
                        id: artistDetails.id,
                        name: artistDetails.name,
                        fans: artistDetails.fansCount,
                        photo: artistDetails.picture.large[0],
                        bio: artistDetails.bio,
                        social: artistDetails.social
                    }
                })
            else
                scrapedList.push({
                    ...artist, details: {
                        id: "",
                        name: artist.name,
                        fans: 0,
                        photo: "",
                        bio: null,
                        social: null
                    }
                })
        }
        else
            scrapedList.push({
                ...artist, details: {
                    id: "",
                    name: artist.name,
                    fans: 0,
                    photo: "",
                    bio: null,
                    social: null
                }
            })

        progressBar.increment(1);
    }
    progressBar.stop();
    console.log(`Scraped ${artistsCount} artists in: ${((Date.now() - start) / 1000)} secs.`)
    console.log()
    return scrapedList;

}

async function scrappeArtistPhoto(artists: OrderedArtistWithDetails[]) {
    const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
    const start = Date.now();

    console.log("Scraping Artist Photo");
    progressBar.start(artists.length, 0);

    for (let artist of artists) {
        await ScrapeCover.saveFromURL(artist.details.photo.replace("500x500", "1800x1800"), artist.name)
        progressBar.increment(1);
    }

    progressBar.stop();
    console.log(`Scraped ${artists.length} photos in: ${((Date.now() - start) / 1000)} secs.`)
    console.log()
}

// function clearConsoleAndScrollbackBuffer() {
//     process.stdout.write('\u001b[3J\u001b[1J');
//     console.clear();
// }

async function initTrackSrape() {
    console.log("SCRAPPING SONGS METADATA\t\t")
    // clearConsoleAndScrollbackBuffer();

    const songs = await scrapeTracksMetadata(process.env.MUSIC_DIR || "");
    const songsByArtist = await orderTracksByArtist(songs);
    const scrapedArtists = await scrapeArtistList(songsByArtist);
    await scrapeAlbumCovers(scrapedArtists);
    await scrappeArtistPhoto(scrapedArtists);
    await saveToDatabase(scrapedArtists);

    process.exit(0);
}

initTrackSrape();



