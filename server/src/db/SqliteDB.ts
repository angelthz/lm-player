import Database from "better-sqlite3";
import path from "node:path";


export class SqliteDB extends Database {
	constructor(fileName?: string | Buffer<ArrayBufferLike> | undefined, options?: Database.Options) {
		super(path.join(__dirname, "MV1.db"), options);
		// console.log("SQLITE: ", __dirname)
	}
}