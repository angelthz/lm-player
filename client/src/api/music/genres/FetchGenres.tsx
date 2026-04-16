import { BASE_URL } from "src/env/HostURL";
import { GenresDTO, SongDTO } from "src/types/types";
import { logger } from "src/utils/Logger";

export const FetchGenres = {
    getAll: async () => {
        const req = await fetch(`${BASE_URL}/api/music/genres`);
        const json = await req.json();
        return json as GenresDTO[];
    },
    getByIdPaginated: async (id: string, offset?: number, limit?: number) => {
        logger.log("Page: ", id, offset)
        let req = await fetch(`${BASE_URL}/api/music/genre/songs/${id}?limit=${15}&offset=${offset || 0}`);
        let json = await req.json() as SongDTO[];
        await new Promise(resolve => setTimeout(resolve, 250));
        return json;
    }
}