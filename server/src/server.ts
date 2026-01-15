import express from "express";
import path from "node:path";
import fs from "node:fs"


function server() {
    console.log("Hello from Express")

    const app = express();


    app.use(express.static(path.join(__dirname, "public")));


    // redireccion para el client SPA
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


    app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log("Request Received")
        res.json({ status: "ok", code: 200, msg: "Hello From Express 3000" });
    });



    app.listen(3000, () => {
        console.log("Backend listening on: http://localhost:3000");
    })
}


server();

