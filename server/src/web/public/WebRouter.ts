import { Router } from "express";
import { RequestSongController } from "./music/RequestSongController";

export const webRouterInit = () => {

    const requestSongController = new RequestSongController();
    const WebRouter = Router();

    //song file
    //stream/song/33/heartbreaker-remaster.mp3
    //get/song/33/heartbreaker-remaster.mp3
    WebRouter.get("/stream/song/:id/:file", requestSongController.streamSong);
    WebRouter.get("/get/song/:id/:file", requestSongController.getSong);

    return WebRouter;

}
