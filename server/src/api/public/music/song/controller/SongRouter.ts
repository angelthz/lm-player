import { Router } from "express";
import { SongController } from "./SongController";


export default function songRouterInit() {
    //controller
    const controller = new SongController();

    //router
    const SongRouter = Router();

    SongRouter.get("/api/music/songs", controller.getAllSongs);
    SongRouter.get("/api/music/songs/recent-played", controller.getRecentPlayedSongs);
    SongRouter.get("/api/music/songs/most-played", controller.getMostPlayedSongs);
    SongRouter.post("/api/music/songs/register-activity", controller.addSongActivity);
    //get song by id
    SongRouter.get("/api/music/songs/:id", controller.getSongById);

    return SongRouter;

}

// export { songRouterInit };