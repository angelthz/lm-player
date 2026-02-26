import { Router } from "express";
import { ArtistController } from "./ArtistController";

export const artistRouterInit = () => {
    const controller = new ArtistController();
    const ArtistsRouter = Router();

    ArtistsRouter.get("/api/music/artists", controller.getAllArtists);
    ArtistsRouter.get("/api/music/artist/:id", controller.getArtistById);
    //
    ArtistsRouter.get("/api/music/artist/:id/albums", controller.getArtistAlbums);
    ArtistsRouter.get("/api/music/artist/:id/songs/", controller.getArtistSongs);
    //
    ArtistsRouter.get("/api/music/artist/:id/songs/recent-played", controller.getRecentePlayedByArtist);
    ArtistsRouter.get("/api/music/artist/:id/songs/most-played", controller.getMostPlayedByArtist);
    //
    ArtistsRouter.get("/api/music/artist/:id/albums/collaborations/", controller.getArtistAlbumsWithCollaborations);
    // ArtistsRouter.get("/api/music/artist/albums/collaborations/songs/:id", controller.getArtistAlbumsWithCollaborations);
    // ArtistsRouter.get("/api/music/artist/collaborations/album/:id", controller.getMostPlayedByArtist);
    return ArtistsRouter;
}
