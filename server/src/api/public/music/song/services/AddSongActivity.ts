import { Service } from "../../service/Service";
import { SongModel } from "../model/SongModel";

import { SongBodyParam, SongDTO } from "./SongValidations";


interface BodyParams {
    id: string;
}


export class AddSongActivity extends Service<SongModel, { ok: boolean, msg: string }, null, null, SongBodyParam> {
    constructor(model: SongModel) {
        super(model);
    }

    public async runService({ bParams }: { bParams: SongBodyParam }) {
        let res = await this.model.addSongActivity(bParams.id);

        if (res.changes === 1)
            return { ok: true, msg: "Song activity registered successfully" };
        else
            return { ok: true, msg: `Something failed trying to register activity with the id: ${bParams.id}` };
    }
}