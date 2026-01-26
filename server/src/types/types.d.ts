// MARK: SQL TYPES

export interface SongRow {
    id: number | bigint
    title: string
    album: string
    artist: string
    collaborator: string
    track_num: number
    duration: number
    genres: string
    plain_lyrics: string
    sync_lyrics: string
    url: string
    x64: string
    x128: string
    x256: string
    x512: string
    x1200: string
}

export interface RecentPlayedSongRow extends SongRow {
    play_date: Date;
}


export interface MostPlayedSongRow extends SongRow {
    play_count: number;
    minutes: number;
    hours: number;
}


export interface SongActivityRow {
    id: number | bigint;
    play_count: number;
    play_date: Date;
    song_id: number | bigint;
}

export interface AlbumRow {
    id: number | bigint;
    artist: string;
    album_name: string;
    release_year: string;
    total_songs: number;
    minutes: number;
    hours: number;
    x64: string;
    x128: string;
    x256: string;
    x512: string;
    x1200: string;
}

export interface ArtistRow {
    id: number | bigint;
    name: string;
    albums: number;
    songs: number;
    minutes: number;
    hours: number;
    x64: string;
    x128: string;
    x256: string;
    x512: string;
    x1200: string;
}


export interface GenreRow {
    id: number | bigint;
    name: string;
}


export interface RowUpdateLog {
    changes: number;
    lastInsertetRowid: number | bigint;
}

// MARK: DTO TYPES

export interface Cover {
    x64: string
    x128: string
    x256: string
    x512: string
    x1200: string
}

export interface ExtendedCover extends Cover {
    x1800: string;
}

export interface SongDTO {
    id: number | bigint
    title: string
    album: string
    artist: string
    collaborator?: string
    trackNum?: number
    duration?: number
    genres?: string
    plainLyric?: string
    syncLyrics?: string
    url?: string
    covers?: Cover
}

export interface RecentPlayedSongDTO extends SongDTO {
    playDate: Date;
}

// MARK: OTHERS

export interface ScrapedCollaborator {
    artist: string;
}

export interface ScrapedTrack {
    artist: string;
    album: string;
    title: string;
    trackNum: number;
    duration: number;
    genres: string[];
    collaborators: string[];
    plainLyrics: string;
    syncLyrics: string;
    releaseYear: number;
    cover: {
        format: string;
        type?: string;
        description?: string;
        data: Uint8Array;
    } | null;
    role: string;
    path: string;
    fileName: string;
}


export interface ScrapedArtistMetadata {
    artist: string
    bio: string[]
    cover: string
    colorCode: string
    activeYears: string
    location: string
    members: string[]
}

export interface LastFMScrapedArtistMetadata {
    artist: string
    bio: string[]
    cover: string
    colorCode: string
    activeYears: string
    location: string
    members: string[]
}


export interface ScrapedCover {
    paths: { size: number, base?: string, dir: string }[],
    urls: { size: number, url: string }[]
}

interface OrderedAlbum {
    name: string;
    year: number;
    cover: { x64: string, x128: string, x256: string, x512: string, x1200: string },
    songs: ScrapedTrack[];
    isCollab: boolean;
}

interface OrderedArtist {
    name: string;
    photo: ExtendedCover;
    albums: OrderedAlbum[];
}



interface OrderedArtistExtended extends OrderedArtist {
    info: ScrapedArtistMetadata
}




// MARK: SCRAPED    
export interface DeezerArtistAPI {
    data: Daum[]
}

export interface DeezerArtistDetails {
    id: number
    name: string
    link: string
    picture: string
    picture_small: string
    picture_medium: string
    picture_big: string
    picture_xl: string
    nb_album: number
    nb_fan: number
    radio: boolean
    tracklist: string
    type: string
}


//