import fs from "node:fs";
import path from "node:path";
import Database from 'better-sqlite3';


function createDatabase() {
    let dbPath = path.join(__dirname, "MV1.db");
    let schemePath = path.join(__dirname, "scheme.sql");

    // let db = new Database("MV1.db", { fileMustExist: true, verbose: console.log });

    if (fs.existsSync(dbPath)) {
        console.log("DB ALREADY EXISTS");
    }
    else {
        if (fs.existsSync(schemePath)) {
            console.log("CREATING A NEW DATABASE");
            let db = new Database(dbPath);


            let sql = fs.readFileSync(schemePath, "utf-8");

            db.exec(sql)
            db.close();

            // db.exec(sql);
        }
    }
}

createDatabase();