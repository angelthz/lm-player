import { BASE_URL } from "src/env/HostURL";
import { ArtistDetailDTO, ArtistDTO } from "src/types/types";

export const FetchArtists = {
    getAll: async ({ pageParam }: { pageParam: number }): Promise<ArtistDTO[]> => {
        let req = await fetch(`${BASE_URL}/api/music/artists?limit=18&offset=${pageParam}&bio=false`);
        let json = await req.json();
        await new Promise(resolve => setTimeout(resolve, 200));
        return json as ArtistDTO[];
    },
    getArtistDetails: async (id: string): Promise<ArtistDetailDTO> => {
        const rawReq = await fetch(`${BASE_URL}/api/music/artist/${id}`);
        const jsonReq = await rawReq.json() as ArtistDetailDTO;
        return jsonReq;
    }
}