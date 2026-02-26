import { Service } from "../../service/Service";
import { ArtistModel } from "../model/ArtistModel";
import { ArtistCollaborationAlbumsDTO, ArtistRParams } from "./ArtistValidations";

export class GetCollaborations extends Service<ArtistModel, ArtistCollaborationAlbumsDTO, ArtistRParams, null, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: ArtistRParams }) {
        let query = await this.model.getAlbumsWithCollaborations(rParams.id);
        return query.map(row => ArtistCollaborationAlbumsDTO.parse(row));
    }
}