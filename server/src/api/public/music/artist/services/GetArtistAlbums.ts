// api/music/artist/songs/:id
// api/music/artist/:id/songs
// api/music/artist/:id/albums


import { AlbumRow, ArtistRow } from "../../../../../types/types";
import { ArtistModel } from "../model/ArtistModel";
import { ElementNotFoundError } from "../../errors/Errors";
import { AlbumDetailDTO, AlbumDTO } from "../../album/services/AlbumValidations";
import { Service } from "../../service/Service";
import { ArtistRParams } from "./ArtistValidations";



export class GetArtistAlbums extends Service<ArtistModel, AlbumDetailDTO, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let query = await this.model.getArtistAlbums(rParams.id);

        return query.map(row => AlbumDetailDTO.parse(row));
    }
}