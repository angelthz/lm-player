import z from "zod";
import { BooleanScheme, PaginationScheme } from "../../shared/SharedValidations";
import { AlbumDetailRow, AlbumDTO, AlbumRow } from "../../album/services/AlbumValidations";
import { SongRow } from "../../song/services/SongValidations";

export type ArtistRow = z.infer<typeof ArtistRow>;
export type ArtistDTO = z.infer<typeof ArtistDTO>;

export type ArtistDetailRow = z.infer<typeof ArtistDetailRow>;
export type ArtistDetailDTO = z.infer<typeof ArtistDetailDTO>;

export type ArtistCollaborationAlbumsRow = z.infer<typeof ArtistCollaborationAlbumsRow>;
export type ArtistCollaborationAlbumsDTO = z.infer<typeof ArtistCollaborationAlbumsDTO>;


export type CollaborationsRow = z.infer<typeof CollaborationsRow>;
export type CollaborationsDTO = z.infer<typeof CollaborationsDTO>;

const Cover = z.object({
    x64: z.string(),
    x128: z.string(),
    x256: z.string(),
    x512: z.string(),
    x1200: z.string(),
})


const Photo = Cover.extend({
    x1800: z.string()
})

const Duration = z.object({
    seconds: z.union([z.null(), z.number()]).default(0),
    minutes: z.union([z.null(), z.number()]),
    hours: z.union([z.null(), z.number()]),
});

const Collaborator = z.object({
    id: z.number(),
    name: z.string()
})

// MARK: ROW & DTO

export const ArtistRow = z.object({
    artist_id: z.number(),
    artist_name: z.string(),
    albums_count: z.xor([z.number(), z.null()]),
    songs_count: z.xor([z.number(), z.null()]),
    is_favorite: z.preprocess((val: number) => val === 1 ? true : false, z.boolean()),
    bio: z.string(),
    photo: z.preprocess((str: string) => JSON.parse(str), Photo),
    artist_time_count: z.preprocess((str: string) => JSON.parse(str), Duration)
});


export const ArtistDTO = ArtistRow.transform(row => ({
    artistId: row.artist_id,
    artistName: row.artist_name,
    albumsCount: row.albums_count,
    songsCount: row.songs_count,
    isFavorite: row.is_favorite,
    bio: row.bio,
    photo: row.photo,
    artistTimeCount: {
        seconds: row.artist_time_count.seconds || 0,
        minutes: row.artist_time_count.minutes || 0,
        hours: row.artist_time_count.hours || 0
    },
}));



export const CollaborationsRow = z.object({
    album_id: z.number(),
    album_name: z.string(),
    release_year: z.number(),
    main_artist_id: z.number(),
    main_artist_name: z.string(),
    collaborators: z.preprocess((rawJson: string) => JSON.parse(rawJson), z.array(Collaborator)),
    cover: z.preprocess((rawJson: string) => JSON.parse(rawJson), Cover)
})


export const CollaborationsDTO = CollaborationsRow.transform(row => ({
    albumId: row.album_id,
    albumName: row.album_name,
    releaseYear: row.release_year,
    mainArtist: {
        id: row.main_artist_id,
        name: row.main_artist_name
    },
    collaborators: row.collaborators,
    cover: row.cover
}));




export const ArtistDetailRow = ArtistRow.extend({
    albums: z.preprocess((str: string) => JSON.parse(str), z.array(AlbumDTO)),
});


export const ArtistDetailDTO = ArtistDetailRow.transform(row => ({
    artistId: row.artist_id,
    artistName: row.artist_name,
    albumsCount: row.albums_count || 0,
    songsCount: row.songs_count || 0,
    bio: row.bio,
    photo: row.photo,
    artistTimeCount: {
        seconds: row.artist_time_count.seconds || 0,
        minutes: row.artist_time_count.minutes || 0,
        hours: row.artist_time_count.hours || 0
    },
    albums: row.albums.every(a => Object.values(a).every(v => v === null)) ? [] : row.albums
}));


export const ArtistCollaborationAlbumsRow = AlbumRow.omit({ artist_id: true, artist_name: true, songs_count: true, duration: true }).extend({
    main_artist_id: z.number(),
    main_artist_name: z.string(),
    collaborators: z.preprocess((str: string) => JSON.parse(str), z.array(Collaborator))
});

export const ArtistCollaborationAlbumsDTO = ArtistCollaborationAlbumsRow.transform(row => ({
    albumId: row.album_id,
    albumName: row.album_name,
    releaseYear: row.release_year,
    mainArtistId: row.main_artist_id,
    mainArtistName: row.main_artist_name,
    collaborators: row.collaborators,
    cover: row.cover
}));

// MARK: PARAMS

export type ArtistsQParams = z.infer<typeof ArtistsQParams>;
export type ArtistRParams = z.infer<typeof ArtistRParams>;

export const ArtistsQParams = PaginationScheme.extend({
    artistId: BooleanScheme.optional(),
    artistName: BooleanScheme.optional(),
    albumsCount: BooleanScheme.optional(),
    songsCount: BooleanScheme.optional(),
    bio: BooleanScheme.optional(),
    photo: BooleanScheme.optional(),
    albums: BooleanScheme.optional(),
    artistTimeCount: BooleanScheme.optional(),
})


export const ArtistRParams = z.object({
    id: z.coerce.number()
})