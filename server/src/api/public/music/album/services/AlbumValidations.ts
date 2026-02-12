import z from "zod";
import { BooleanScheme, PaginationScheme } from "../../shared/SharedValidations";
import { SongRow } from "../../song/services/SongValidations";


export type AlbumRow = z.infer<typeof AlbumRow>;
export type AlbumDTO = z.infer<typeof AlbumDTO>;
export type AlbumDetailRow = z.infer<typeof AlbumDetailRow>;
export type AlbumDetailDTO = z.infer<typeof AlbumDetailDTO>;

type Cover = z.infer<typeof Cover>;
type Duration = z.infer<typeof Duration>;

const Cover = z.object({
    x64: z.string(),
    x128: z.string(),
    x256: z.string(),
    x512: z.string(),
    x1200: z.string(),
})

const Duration = z.object({
    seconds: z.number(),
    minutes: z.number(),
    hours: z.number(),
});

const Collaborator = z.object({
    id: z.number(),
    name: z.string()
});

export const AlbumRow = z.object({
    artist_id: z.xor([z.null(), z.number()]),
    artist_name: z.xor([z.null(), z.string()]),
    album_id: z.xor([z.null(), z.number()]),
    album_name: z.xor([z.null(), z.string()]),
    release_year: z.xor([z.null(), z.number()]),
    songs_count: z.xor([z.null(), z.number()]),
    is_favorite: z.preprocess((val: number) => val === 1 ? true : false, z.boolean()),
    duration: z.preprocess((res: string) => JSON.parse(res), z.xor([z.null(), Duration])),
    cover: z.preprocess((res: string) => JSON.parse(res), z.xor([z.null(), Cover]))
});

export const AlbumDTO = AlbumRow.transform((row) => ({
    artistId: row.artist_id,
    artistName: row.artist_name,
    albumId: row.album_id,
    albumName: row.album_name,
    isFavorite: row.is_favorite,
    releaseYear: row.release_year,
    songCount: row.songs_count,
    duration: row.duration,
    cover: row.cover
}));

export const AlbumDetailRow = z.object({
    album_id: z.number(),
    album_name: z.string(),
    artist_id: z.number(),
    artist_name: z.string(),
    songs_count: z.number(),
    is_favorite: z.preprocess((val: number) => val === 1 ? true : false, z.boolean()),
    duration: z.preprocess((str: string) => JSON.parse(str), Duration),
    cover: z.preprocess((str: string) => JSON.parse(str), Cover),
    release_year: z.number(),
    songs: z.string().transform((val: string) => JSON.parse(val) as SongRow[]),
}).nullish();

export const AlbumDetailDTO = AlbumDetailRow.transform(row => row ? {
    albumId: row.album_id,
    albumName: row.album_name,
    artistId: row.artist_id,
    artistName: row.artist_name,
    isFavorite: row.is_favorite,
    songsCount: row.songs_count,
    releaseYear: row.release_year,
    duration: row.duration,
    cover: row.cover,
    songs: row.songs.map((s) => ({
        songId: s.song_id,
        songTitle: s.song_title,
        artistId: s.artist_id,
        artistName: s.artist_name,
        albumId: s.album_id,
        albumName: s.album_name,
        collaborators: s.collaborators || [],
        trackNum: s.track_num,
        duration: s.duration,
        releaseYear: s.release_year,
        genres: s.genres,
        playCount: s.play_count,
        url: s.url,
        cover: s.cover
    }))
} : {});

// MARK: params

export type AlbumQParams = z.infer<typeof AlbumQParams>;
export type AlbumRParams = z.infer<typeof AlbumRParams>;

export const AlbumQParams = PaginationScheme.extend({
    artistId: BooleanScheme.optional(),
    artistName: BooleanScheme.optional(),
    albumId: BooleanScheme.optional(),
    albumName: BooleanScheme.optional(),
    releaseYear: BooleanScheme.optional(),
    songCount: BooleanScheme.optional(),
    duration: BooleanScheme.optional(),
    covers: BooleanScheme.optional(),
})


export const AlbumRParams = z.object({
    albumId: z.coerce.number(),
})