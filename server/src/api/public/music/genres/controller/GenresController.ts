import { NextFunction, Request, Response } from "express";
import { MusicServices } from "../../shared/MusicServices";
import z from "zod";
import { GenreRParams } from "../services/GenresValidation";
import { SongQueryParams } from "../../song/services/SongValidations";

export class GenreController {
    public async getAllGenres(req: Request, res: Response, next: NextFunction) {
        try {
            let result = await MusicServices.genres.getall.runService();
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.json(err.issues).status(400);
            next(err);
        }
    }


    public async getSongsByGenre(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = GenreRParams.parse(req.params);
            let qParams = SongQueryParams.parse(req.query);
            let result = await MusicServices.genres.getSongsByGenre.runService({ rParams, qParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.json(err.issues).status(400);
            next(err);
        }
    }
}