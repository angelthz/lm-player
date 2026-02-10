import { RecentPlayedSongDTO, SongDTO } from "../../../../../types/types";
import { SongModel } from "../model/SongModel";
import { number, z } from "zod";
import { RecentSongDTO, RecentSongQParams, SongQueryParams } from "./SongValidations";
import { PaginationQueryParams } from "../controller/SongController";
import { PaginatedService } from "../../service/Service";


export class GetRecentPlayedSongs
    extends PaginatedService<SongModel, Partial<RecentSongDTO>, null, RecentSongQParams, null> {
    constructor(model: SongModel) {
        super(model);
    }

    public async runService({ qParams }: { qParams: RecentSongQParams }) {
        let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);
        let query = await this.model.getRecentPlayed(limit, offset);

        if (this.hasFilters(qParams)) {
            return query.map(row => RecentSongDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        }
        else
            return query.map(row => RecentSongDTO.parse(row));
    }

}