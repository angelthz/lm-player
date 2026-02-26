import { SongRow } from "../../../../../types/types";
import { Service } from "../../service/Service";
import { SongDTO } from "../../song/services/SongValidations";
import { ArtistModel } from "../model/ArtistModel";
import { ArtistRParams } from "./ArtistValidations";

export class GetArtistSongs extends Service<ArtistModel, SongDTO, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let query = await this.model.getArtistSongs(rParams.id);

        return query.map(row => SongDTO.parse(row));
    }
}