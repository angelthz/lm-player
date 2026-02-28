import { Service } from "../../service/Service";
import { GenreModel } from "../model/GenreModel";
import { GenreDTO, GenreRParams } from "./GenresValidation";

export class GetAllGenres extends Service<GenreModel, GenreDTO, null, null, null> {
    constructor(model: GenreModel) {
        super(model);
    }

    public async runService() {
        let query = await this.model.getGenres();
        return query;
    }
}