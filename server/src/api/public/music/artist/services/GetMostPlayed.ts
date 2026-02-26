import { Service } from "../../service/Service";
import { MostPlayedSongDTO } from "../../song/services/SongValidations";
import { ArtistModel } from "../model/ArtistModel";
import { ArtistRParams } from "./ArtistValidations";

export class GetMostPlayed extends Service<ArtistModel, MostPlayedSongDTO, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let query = await this.model.getMostPlayed(rParams.id);

        return query.map(row => MostPlayedSongDTO.parse(row));
    }
}