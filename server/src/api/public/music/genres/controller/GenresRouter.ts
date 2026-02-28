import { Router } from "express";
import { GenreController } from "./GenresController";

export const genresRouterInit = () => {
    const controller = new GenreController();
    const GenresRouter = Router();

    GenresRouter.get("/api/music/genres", controller.getAllGenres);
    GenresRouter.get("/api/music/genre/songs/:id", controller.getSongsByGenre);

    return GenresRouter;
}

