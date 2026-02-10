import z, { boolean, object } from "zod";
import { BooleanScheme, PaginationScheme } from "../../shared/SharedValidations";


export type SongRow = z.infer<typeof SongRow>;
export type SongDTO = z.infer<typeof SongDTO>;

export type RecentSongRow = z.infer<typeof RecentSongRow>;
export type RecentSongDTO = z.infer<typeof RecentSongDTO>;

export type MostPlayedSongRow = z.infer<typeof MostPlayedSongRow>;
export type MostPlayedSongDTO = z.infer<typeof MostPlayedSongDTO>;



const Cover = z.object({
    x64: z.string(),
    x128: z.string(),
    x256: z.string(),
    x512: z.string(),
    x1200: z.string(),
})

const Collaborator = z.object({
    id: z.number(),
    name: z.string()
});

const Lyrics = z.object({
    plain: z.string(),
    sync: z.string()
})

const Duration = z.object({
    seconds: z.number(),
    minutes: z.number(),
    hours: z.number()
})

export const SongRow = z.object({
    song_id: z.number(),
    song_title: z.string(),
    album_id: z.number(),
    album_name: z.string(),
    artist_id: z.number(),
    artist_name: z.string(),
    collaborators: z.preprocess((str: string) => JSON.parse(str), z.xor([z.null(), z.array(Collaborator)])),
    is_favorite: z.preprocess((val: number) => val === 1 ? true : false, z.boolean()),
    track_num: z.number(),
    duration: z.preprocess((str: string) => JSON.parse(str), Duration),
    release_year: z.number(),
    genres: z.preprocess((str: string) => JSON.parse(str), z.array(z.string())),
    lyrics: z.preprocess((str: string) => JSON.parse(str), Lyrics).optional(),
    play_count: z.number(),
    url: z.string(),
    cover: z.preprocess((str: string) => {
        return JSON.parse(str)
    }, Cover)
});

export const SongDTO = SongRow.transform(row => ({
    songId: row.song_id,
    songTitle: row.song_title,
    albumId: row.album_id,
    albumName: row.album_name,
    artistId: row.artist_id,
    artistName: row.artist_name,
    trackNum: row.track_num,
    isFavorite: row.is_favorite,
    duration: row.duration,
    releaseYear: row.release_year,
    genres: row.genres,
    collaborators: row.collaborators || [],
    lyrics: row.lyrics,
    playCount: row.play_count,
    url: row.url,
    cover: row.cover
}));

const RecentSongRow = SongRow.extend({
    latest_play_date: z.coerce.date()
});

export const RecentSongDTO = RecentSongRow.transform(row => ({
    songId: row.song_id,
    songTitle: row.song_title,
    albumId: row.album_id,
    albumName: row.album_name,
    artistId: row.artist_id,
    artistName: row.artist_name,
    isFavorite: row.is_favorite,
    trackNum: row.track_num,
    duration: row.duration,
    genres: row.genres,
    lyrics: row.lyrics,
    url: row.url,
    playCount: row.play_count,
    latestPlayDate: row.latest_play_date,
    cover: row.cover
}));


const MostPlayedSongRow = SongRow.extend({
    play_count: z.number().nonnegative()
});

export const MostPlayedSongDTO = MostPlayedSongRow.transform((row, ctx) => ({
    songId: row.song_id,
    songTitle: row.song_title,
    albumId: row.album_id,
    albumName: row.album_name,
    artistId: row.artist_id,
    artistName: row.artist_name,
    isFavorite: row.is_favorite,
    collaborators: row.collaborators,
    genres: row.genres,
    trackNum: row.track_num,
    duration: row.duration,
    lyrics: row.lyrics,
    url: row.url,
    playCount: row.play_count,
    cover: row.cover
}));


// MARK: PARAMS

export type SongQueryParams = z.infer<typeof SongQueryParams>;
export type RecentSongQParams = z.infer<typeof RecengSongQParams>;
export type MostPlayedSongQParams = z.infer<typeof MostPlayedSongQParams>;
export type SongRouteParams = z.infer<typeof SongRouteParams>;
export type SongBodyParam = z.infer<typeof SongBodyParam>;

export type SongQueryParamsPaginated = z.infer<typeof SongQueryParamsPaginated>;



export const SongQueryParams = z.object({
    songId: BooleanScheme.optional(),
    songTitle: BooleanScheme.optional(),
    albumId: BooleanScheme.optional(),
    albumName: BooleanScheme.optional(),
    artistId: BooleanScheme.optional(),
    artistName: BooleanScheme.optional(),
    collaborators: BooleanScheme.optional(),
    trackNum: BooleanScheme.optional(),
    duration: BooleanScheme.optional(),
    genres: BooleanScheme.optional(),
    plainLyrics: BooleanScheme.optional(),
    syncLyrics: BooleanScheme.optional(),
    play_count: BooleanScheme.optional(),
    url: BooleanScheme.optional(),
    cover: BooleanScheme.optional(),
})

export const SongQueryParamsPaginated = SongQueryParams.extend({
    limit: z.coerce.number().refine(val => val <= 100, { error: "The max value for limit params is 100'" }).optional(),
    offset: z.coerce.number().optional()
})


export const RecengSongQParams = SongQueryParamsPaginated.extend({
    latestPlayDate: BooleanScheme.optional(),
})

export const MostPlayedSongQParams = SongQueryParams.extend({
    playCount: BooleanScheme.optional(),
    playedTime: BooleanScheme.optional()
});


export const SongRouteParams = z.object({
    id: z.coerce.number(),
});

export const SongBodyParam = z.object({
    id: z.coerce.number(),
})