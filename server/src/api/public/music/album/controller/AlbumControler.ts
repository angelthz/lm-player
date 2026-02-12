import { NextFunction, Request, Response } from "express";

import { MusicServices } from "../../shared/MusicServices";
import { InvalidPaginationError } from "../../errors/Errors";
import { AlbumQParams, AlbumRParams } from "../services/AlbumValidations";
import z from "zod";

export class AlbumControler {

    public async getAllAlbums(req: Request, res: Response, next: NextFunction) {
        try {
            let qParams = AlbumQParams.parse(req.query);
            console.log(qParams)
            let result = await MusicServices.album.getAll.runService({ qParams });
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues)
            next(err);
        }
    }

    public async getAlbumById(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = AlbumRParams.parse(req.params);
            let result = await MusicServices.album.getById.runService({ rParams });
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof InvalidPaginationError)
                return res.status(400).json({ message: err.message })
            next(err);
        }
    }

    public async getAlbumSongs(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = AlbumRParams.parse(req.params);
            let result = await MusicServices.album.getAlbumSongs.runService({ rParams });
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof InvalidPaginationError)
                return res.status(400).json({ message: err.message })
            next(err);
        }
    }


}