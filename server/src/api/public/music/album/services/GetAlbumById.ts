import { AlbumModel } from "../model/AlbumModel";
import { AlbumDetailDTO, AlbumRParams } from "./AlbumValidations";
import { Service } from "../../service/Service";



export class GetAlbumById extends Service<AlbumModel, AlbumDetailDTO, AlbumRParams, null, null> {
    constructor(model: AlbumModel) {
        super(model);
    }

    public async runService({ rParams }: { rParams: AlbumRParams }) {
        let query = await this.model.getAlbumById(rParams.albumId);
        // console.log(query)
        // if(query)
        return AlbumDetailDTO.parse(query);
        // else
        //     return {}
    }

}

