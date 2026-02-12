import { AlbumModel } from "../model/AlbumModel";
import { PaginatedService } from "../../service/Service";
import { AlbumDTO, AlbumQParams } from "./AlbumValidations";


export class GetAllAlbums extends PaginatedService<AlbumModel, Partial<AlbumDTO>, null, AlbumQParams, null> {
    constructor(model: AlbumModel) {
        super(model);
    }

    public async runService({ qParams }: { qParams: AlbumQParams }) {
        let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);
        let query = await this.model.getAllAlbums(limit, offset);

        console.log()
        console.log(limit, offset)
        console.log()

        if (this.hasFilters(qParams))
            return query.map(row => AlbumDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        else
            return query.map(row => AlbumDTO.parse(row));
    }
}