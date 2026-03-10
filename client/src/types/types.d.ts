//MARK: API TYPES

export interface CoverDTO {
    x64: string;
    x128: string;
    x256: string;
    x512: string;
    x1200: string;
}

export interface PhotoDTO extends CoverDTO {
    x1800: string;
}

export interface DurationDTO {
    seconds: number;
    minutes: number;
    hours: number;
}

export interface CollaboratorDTO {
    id: number;
    name: string;
}

export interface LyricsDTO {
    plain: string;
    sync: string;
}


export interface SongDTO {
    songId: number;
    songTitle: string;
    albumId: number;
    albumName: string;
    artistId: number;
    artistName: string;
    isFavorite: boolean;
    releaseYear: number;
    collaborators?: Collaborator[];
    genres?: string[];
    trackNum?: number;
    duration?: DurationDTO;
    lyrics?: LyricsDTO;
    latestPlayDate?: string;
    url?: string;
    playCount: number;
    cover?: CoverDTO;
}

export type RecentPlayedSongDTO = Omit<SongDTO, "collaborators" | "lyrics">;

export type MostPlayedSongDTO = Omit<SongDTO, "collaborators" | "lyrics" | "latestPlayDate">

export interface AlbumDTO {
    artistId: number;
    artistName: string;
    albumId: number;
    albumName: string;
    isFavorite: boolean;
    releaseYear: number;
    songsCount: num;
    duration: DurationDTO;
    cover: CoverDTO;
    songs: SongDTO[]
}

type CollabAlbum = Omit<AlbumDTO, "artistId" | "artistName" | "songsCount" | "duration" | "songs">;

export interface AlbumCollaborationDTO {
    albumId: number;
    albumName: string;
    releaseYear: number;
    cover: CoverDTO;
    mainArtist: {
        id: number;
        name: string;
    }
    collaborators: CollaboratorDTO[],
}

export interface ArtistDTO {
    artistId: number,
    artistName: string,
    albumsCount: number,
    songsCount: number,
    isFavorite: boolean,
    bio: string,
    photo: PhotoDTO,
    artistTimeCount: DurationDTO,
}

export interface ArtistDetailDTO extends ArtistDTO {
    albums: AlbumDTO[];
    collaborations: AlbumCollaborationDTO[],
    recentPlayed: SongDTO[],
    mostPlayed: SongDTO[],
}


export interface ArtistAlbumDTO extends ArtistDTO {
    albums: AlbumDTO[];
}


export interface GenresDTO {
    id: number | bigint;
    name: string;
}

