
import { GetSongService } from "./GetSongService"
import { RequestSongModel } from "./RequestSongModel"

const requestSongModel = new RequestSongModel();

const RequestSongService = {
    song: {
        getPath: new GetSongService(requestSongModel)
    },
}

export { RequestSongService };