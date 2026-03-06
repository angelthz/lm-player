import { string } from "prop-types";
import { FileNotFoundError, WebInvalidParamsError } from "../errors/WebErrors";
import { RequestSongModel } from "./RequestSongModel";

interface Params {
    id: string;
    file: string;
}

export class GetSongService {
    private model: RequestSongModel;

    constructor(model: RequestSongModel) {
        this.model = model;
    }

    public async runService(params: Params): Promise<{ path: string }> {
        let { id, file } = this.validateParamsValues(params);

        let result = await this.model.getSongPath(id, file);

        if (result)
            return result;
        else
            throw new FileNotFoundError(this, file);

    }

    private validateParamsValues(params: Params) {
        let id: number = Number.parseInt(params.id);
        let file: string = params.file;


        if (isNaN(id))
            throw new WebInvalidParamsError<this, string>(this, "id", params.id);

        if (typeof file !== "string")
            throw new WebInvalidParamsError<this, string>(this, "file", params.file);

        return { id, file };

    }
}