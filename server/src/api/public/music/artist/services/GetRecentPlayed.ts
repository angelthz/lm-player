import { ElementNotFoundError } from "../../errors/Errors";
import { Service } from "../../service/Service";
import { RecentSongDTO } from "../../song/services/SongValidations";
import { ArtistModel } from "../model/ArtistModel";
import { ArtistRParams } from "./ArtistValidations";

export class GetRecentPlayed extends Service<ArtistModel, RecentSongDTO, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let query = await this.model.getRecentPlayed(rParams.id);
        return query.map(row => RecentSongDTO.parse(row));
    }
}