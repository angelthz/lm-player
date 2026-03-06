import { NextFunction, Request, Response } from "express";
import { RequestSongService } from "./RequestSongService";
import { FileNotFoundError } from "../errors/WebErrors";
import fs from "fs";

export class RequestSongController {

    //stream a mp3 file
    public async streamSong(req: Request, res: Response, next: NextFunction) {
        try {
            let params = req.params as { id: string, file: string };
            let filePath = await RequestSongService.song.getPath.runService(params);


            const range = req.headers.range || "0";
            const audioSize = fs.statSync(filePath.path).size;
            const chunkSize = 1 * 1e6; //  1MB
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + chunkSize, audioSize - 1);
            const contentLength = end - start + 1;
            const headers = {
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET",
                "Content-Range": `bytes ${start}-${end}/${audioSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "audio/mp3",
            };
            res.writeHead(206, headers);
            const stream = fs.createReadStream(filePath.path, { start, end });
            stream.pipe(res);
        } catch (err) {
            if (err instanceof FileNotFoundError)
                return res.json({ message: err.message }).status(400);
            next(err);
        }
    }


    //serve a mp3 file
    public async getSong(req: Request, res: Response, next: NextFunction) {
        try {
            let params = req.params as { id: string, file: string };
            let filePath = await RequestSongService.song.getPath.runService(params);

            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.header("Access-Control-Allow-Headers", "Range, Content-Type");
            res.header("Access-Control-Allow-Methods", "GET");
            res.status(200).sendFile(filePath.path);

        } catch (err) {
            if (err instanceof FileNotFoundError)
                return res.json({ message: err.message }).status(400);
            next(err);
        }
    }
}