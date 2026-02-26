import { Service } from "../../service/Service";
import { MostPlayedSongDTO, RecentSongDTO } from "../../song/services/SongValidations";
import { ArtistModel } from "../model/ArtistModel";
import { ArtistDetailDTO, ArtistDTO, ArtistRParams, CollaborationsDTO } from "./ArtistValidations";


interface ComposedArtistDetails extends ArtistDetailDTO {
    collaborations: CollaborationsDTO[];
}

type DetailedArtist =
    ArtistDetailDTO |
    { collaborations: CollaborationsDTO } |
    { recentPlayed: RecentSongDTO } |
    { mostPlayed: MostPlayedSongDTO };

export class GetArtistById extends Service<ArtistModel, DetailedArtist, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let details = await this.model.getArtistById(rParams.id);
        let collabs = await this.model.getAlbumsWithCollaborations(rParams.id);
        let mostPlayed = await this.model.getMostPlayed(rParams.id)
        let recentPlayed = await this.model.getRecentPlayed(rParams.id);

        return {
            ...ArtistDetailDTO.parse(details),
            collaborations: collabs.map(c => CollaborationsDTO.parse(c)),
            recentPlayed: recentPlayed.map(rp => RecentSongDTO.parse(rp)),
            mostPlayed: mostPlayed.map(mp => MostPlayedSongDTO.parse(mp))
        }
    }
}
