import { BASE_URL } from "src/env/HostURL";
import { AlbumDTO } from "src/types/types";

export const FetchAlbums = {
    getPaginatedAlbums: async ({ pageParam }: { pageParam: number }): Promise<AlbumDTO[]> => {
        let req = await fetch(`${BASE_URL}/api/music/albums?limit=18&offset=${pageParam}`);
        let json = await req.json();
        await new Promise(resolve => setTimeout(resolve, 250));
        return json as AlbumDTO[];
    },
    getAlbumById: async (albumId: string): Promise<AlbumDTO> => {
        let req = await fetch(`${BASE_URL}/api/music/album/${albumId}`);
        if (!req.ok) throw new Error("Error fetching album")
        let json = await req.json() as AlbumDTO;
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        return json as AlbumDTO;

    }
}