import { BASE_URL } from "src/env/HostURL";
import { SongDTO } from "src/types/types";

export const FetchSong = {
    getAllSongs: async (offset?: number, limit?: number) => {
        let req = await fetch(`${BASE_URL}/api/music/songs?limit=${limit || 25}&offset=${offset || 0}`);
        let json = await req.json() as SongDTO[];
        // await new Promise(resolve => setTimeout(resolve, 1500));
        return json as SongDTO[];
    },
    getMostPlayed: async () => {
        const req = await fetch(`${BASE_URL}/api/music/songs/most-played`);
        const json = await req.json();
        return json as SongDTO[];
    },
    getRecentPlayed: async () => {
        const req = await fetch(`${BASE_URL}/api/music/songs/recent-played`);
        const json = await req.json();
        return json as SongDTO[];
    }
}