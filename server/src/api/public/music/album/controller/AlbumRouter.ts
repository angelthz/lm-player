import { Router } from "express";
import { AlbumControler } from "./AlbumControler";


export const albumRouterInit = () => {
    const controller = new AlbumControler();
    const AlbumRouter = Router();

    //get all albums (songs not included)
    AlbumRouter.get("/api/music/albums", controller.getAllAlbums);
    //get album by id (songs not included) todo: include album songs
    AlbumRouter.get("/api/music/album/:albumId", controller.getAlbumById);
    //get 
    AlbumRouter.get("/api/music/album/songs/:albumId", controller.getAlbumSongs);

    return AlbumRouter;
}



// export { AlbumRouter };