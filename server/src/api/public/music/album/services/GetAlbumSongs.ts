import { Service } from "../../service/Service";
import { SongDTO } from "../../song/services/SongValidations";
import { AlbumModel } from "../model/AlbumModel";
import { AlbumRParams } from "./AlbumValidations";

export class GetAlbumSongs extends Service<AlbumModel, Partial<SongDTO>, AlbumRParams, null, null> {
    constructor(model: AlbumModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: AlbumRParams }) {
        let query = await this.model.getAlbumSongs(rParams.albumId);

        console.log(query)
        return query.map(row => SongDTO.parse(row));
    }

}