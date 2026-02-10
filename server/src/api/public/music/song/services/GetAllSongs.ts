import { number } from "prop-types";
import { SongModel } from "../model/SongModel";

import { off } from "node:cluster";
import { InvalidPaginationError } from "../../errors/Errors";
import { SongRow } from "../../../../../types/types";
import { PaginatedService } from "../../service/Service";
import { SongDTO, SongQueryParamsPaginated } from "./SongValidations";

/* 
    Services Layer: inject the Model in every Service
    and this layer only should return DTO'S
    only accept primitive types and return primitive types as a object
    never return the domain.
    Even is possible to filter the sensitive data in this layer.
*/


export class GetAllSongs extends PaginatedService<SongModel, Partial<SongDTO>, null, SongQueryParamsPaginated, null> {
    constructor(model: SongModel) {
        super(model);
    }

    public async runService({ qParams }: { qParams: SongQueryParamsPaginated }) {
        let { limit, offset } = this.getPaginationValues(qParams.limit, qParams.offset);

        let query = await this.model.getAll(limit, offset);


        if (this.hasFilters(qParams)) {
            return query.map(row => SongDTO.parse(row)).map(dto => this.applyFilters(dto, qParams));
        }
        else
            return query.map(row => SongDTO.parse(row));
    }
}