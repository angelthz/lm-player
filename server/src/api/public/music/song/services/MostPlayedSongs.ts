import { PaginationQueryParams } from "../controller/SongController";
import { SongModel } from "../model/SongModel";
import { PaginatedService } from "../../service/Service";
import { MostPlayedSongDTO, MostPlayedSongQParams, RecentSongDTO } from "./SongValidations";

// export class GetMostPlayedSongs {
//     private model: SongModel;

//     constructor(model: SongModel) {
//         this.model = model;
//     }

//     public async runService(queryParams: PaginationQueryParams) {
//         let { limit, offset } = this.paginationValues(queryParams);
//         let query = await this.model.getMostPlayed(limit, offset);
//         return query.map(row => MostPlayedSongDTO.parse(row));
//     }


//     private paginationValues(queryParams: PaginationQueryParams): { offset: number, limit: number } {
//         let offset = queryParams.offset ? queryParams.offset : 1;
//         let limit = queryParams.limit ? queryParams.limit : 25;

//         return {
//             limit,
//             offset: (limit * (offset - 1)),
//         };
//     }
// }



export class GetMostPlayedSongs
    extends PaginatedService<SongModel, Partial<MostPlayedSongDTO>, null, MostPlayedSongQParams, null> {

    constructor(model: SongModel) {
        super(model);
    }

    public async runService({ qParams }: { qParams: MostPlayedSongQParams }) {

        // let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);

        // let query = await this.model.getMostPlayed(limit, offset);
        let query = await this.model.getMostPlayed();

        if (this.hasFilters(qParams))
            return query.map(row => MostPlayedSongDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        else
            return query.map(row => MostPlayedSongDTO.parse(row));
    }
}