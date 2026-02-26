import { NextFunction, Request, Response } from "express";
import { MusicServices } from "../../shared/MusicServices";
import { InvalidPaginationError } from "../../errors/Errors";
import { ArtistRParams, ArtistsQParams } from "../services/ArtistValidations";
import z from "zod";

export class ArtistController {


    public async getAllArtists(req: Request, res: Response, next: NextFunction) {
        try {
            let qParams = ArtistsQParams.parse(req.query);
            let result = await MusicServices.artist.getAll.runService({ qParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }

    public async getArtistById(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.getById.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }

    public async getArtistAlbums(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.getAlbums.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }

    public async getArtistSongs(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.getSongs.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }


    public async getRecentePlayedByArtist(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.getRecentPlayed.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }

    public async getArtistAlbumsWithCollaborations(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.getArtistAlbumsWithCollaborations.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }
    public async getMostPlayedByArtist(req: Request, res: Response, next: NextFunction) {
        try {
            let rParams = ArtistRParams.parse(req.params);
            let result = await MusicServices.artist.GetMostPlayed.runService({ rParams });
            return res.json(result).status(200);
        } catch (err) {
            if (err instanceof z.core.$ZodError)
                return res.status(400).json(err.issues);
            next(err);
        }
    }
}