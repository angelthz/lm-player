import { PaginatedService } from "../../service/Service";
import { SongDTO, SongQueryParams, SongQueryParamsPaginated } from "../../song/services/SongValidations";
import { GenreModel } from "../model/GenreModel";
import { GenreRParams } from "./GenresValidation";

export class GetSongsByGenre extends PaginatedService<GenreModel, Partial<SongDTO>, GenreRParams, SongQueryParams, null> {
    constructor(model: GenreModel) {
        super(model);
    }

    public async runService({ rParams, qParams }: { rParams: GenreRParams, qParams: SongQueryParamsPaginated }) {
        let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);
        let query = await this.model.getSongsByGenre(rParams.id, limit, offset);

        // console.log(query)

        if (this.hasFilters(qParams))
            return query.map(row => SongDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        else
            return query.map(row => SongDTO.parse(row));
    }
}