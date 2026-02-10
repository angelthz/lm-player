import express from "express";
import path from "node:path";
import fs from "node:fs"
import morgan from "morgan";
import cors from "cors";
import songRouterInit from "./api/public/music/song/controller/SongRouter";



function server() {
    console.log("Hello from Express")

    const app = express();

    //middlewares
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "https://*.devtunnels.ms/"] }));

    //api routes
    app.use(songRouterInit());

    //index
    app.use(express.static(path.join(__dirname, "public")));


    // SPA Client redirect
    app.use((req, res, next) => {
        if (/(.ico|.js|.css|.jpg|.png|.map|api)$/i.test(req.path)) {
            next();
        } else {
            res.header(
                "Cache-Control",
                "private, no-cache, no-store, must-revalidate",
            );
            res.header("Expires", "-1");
            res.header("Pragma", "no-cache");
            if (fs.existsSync(path.join(__dirname, "public", "index.html")))
                res.sendFile(path.join(__dirname, "public", "index.html"));
            else
                next();

        }
    });

    //redirect only in development mode
    app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log("Request Received")
        res.json({ status: "ok", code: 200, msg: "Hello From Express 3000" });
    });

    app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (err instanceof Error) {
            console.log(err.stack);
            return res.status(500).json({ message: err.message });
        }
        console.log(err);
        return res.status(500).json({ message: "Something Broke!" });;
    });

    app.listen(3000, () => {
        console.log("Backend listening on: http://localhost:3000");
    })
}


server();

