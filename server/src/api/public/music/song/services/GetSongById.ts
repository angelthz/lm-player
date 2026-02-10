/* 
    Services Layer: inject the Model in every Service
*/


import { ElementNotFoundError, InvalidParamIdError } from "../../errors/Errors";
import { SongModel } from "../model/SongModel";
import { Service } from "../../service/Service";
import { SongDTO, SongRouteParams } from "./SongValidations";


export class GetSongById extends Service<SongModel, SongDTO, SongRouteParams, null, null> {
    constructor(model: SongModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: SongRouteParams }) {
        let query = await this.model.getById(rParams.id);

        if (query)
            return SongDTO.parse(query);
        else
            throw new ElementNotFoundError(this, `Element Not Found`);
    }
}
