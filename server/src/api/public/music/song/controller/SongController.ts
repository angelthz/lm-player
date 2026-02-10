import { NextFunction, Request, Response } from "express";
import { MusicServices } from "../../shared/MusicServices";
import { ElementNotFoundError, InvalidParamIdError } from "../../errors/Errors";
import z from "zod";
import { MostPlayedSongQParams, SongBodyParam, SongQueryParams, SongQueryParamsPaginated, SongRouteParams } from "../services/SongValidations";



export type PaginationQueryParams = z.infer<typeof PaginationQueryParams>;

const PaginationQueryParams = z.object({
    limit: z.coerce.number().nonnegative().refine(val => val > 50 ? false : true, { message: "To big: expected number to be <= 50" }).optional(),
    offset: z.coerce.number().gt(0).optional()
});


export class SongController {

    public async getAllSongs(req: Request, res: Response, next: NextFunction) {
        try {
            let qParams = SongQueryParamsPaginated.parse(req.query);
            let result = await MusicServices.song.getAll.runService({ qParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }


    public async getSongById(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = SongRouteParams.parse(req.params);
            let result = await MusicServices.song.getById.runService({ rParams });
            // return res.json({ msg: "ok" }).status(200);
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof ElementNotFoundError)
                return res.status(404).json({ message: err.message })
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues)
            next(err);
        }
    }

    public async addSongActivity(req: Request, res: Response, next: NextFunction) {
        try {
            let bParams = SongBodyParam.parse(req.body);

            let result = await MusicServices.song.addActivity.runService({ bParams });

            return res.json(result).status(200);
            // return res.json({ msg: "ok" }).status(200)
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues)
            next(err);
        }
    }

    public async getRecentPlayedSongs(req: Request, res: Response, next: NextFunction) {
        try {
            let queryParams = SongQueryParams.parse(req.query);

            let result = await MusicServices.song.getRecentPlayed.runService({ qParams: queryParams });

            // return res.json({ msg: "ok" }).status(200);
            return res.json(result).status(200)
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues)
            next(err);
        }
    }


    public async getMostPlayedSongs(req: Request, res: Response, next: NextFunction) {
        try {
            let qParams = MostPlayedSongQParams.parse(req.query);

            let result = await MusicServices.song.getMostPlayed.runService({ qParams });

            return res.json(result).status(200)
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues)
            next(err);
        }
    }
}


