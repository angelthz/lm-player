import { ArtistModel } from "../model/ArtistModel";
import { PaginatedService } from "../../service/Service";
import { ArtistDTO, ArtistsQParams } from "./ArtistValidations";


export class GetAllArtists extends PaginatedService<ArtistModel, Partial<ArtistDTO>, null, ArtistsQParams, null> {
    constructor(model: ArtistModel) {
        super(model);
    }

    public async runService({ qParams }: { qParams: ArtistsQParams }) {
        let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);
        let query = await this.model.getAllArtists(limit, offset);

        if (this.hasFilters(qParams))
            return query.map(row => ArtistDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        else
            return query.map(row => ArtistDTO.parse(row));
    }
}