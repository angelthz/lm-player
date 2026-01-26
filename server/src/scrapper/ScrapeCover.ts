import path from "node:path";
import fs from "node:fs";
import { Formmatter } from "../utils/FormatText";
import sharp from "sharp";

export class ScrapeCover {
    public static async saveFromBuffer(buffer: Uint8Array | null, artistName: string, albumName: string) {
        try {
            const sizes = [64, 128, 256, 512, 1200];
            const parsedArtist = new Formmatter(artistName).toDirectoryName();
            const parsedAlbum = new Formmatter(albumName).toDirectoryName();
            const targetPath = path.join(__dirname, "../", "public", "thumbnails", "artist", parsedArtist, parsedAlbum);

            sizes.forEach(size => {
                let filePath = path.join(targetPath, `cover-${size}.jpg`);
                // console.log("target: ", targetPath)

                if (!fs.existsSync(targetPath))
                    fs.mkdirSync(targetPath, { recursive: true });

                if (!fs.existsSync(filePath) && buffer)
                    sharp(buffer).resize(size, size).toFile(filePath);
                else if (!fs.existsSync(filePath)) {
                    let unknownAlbumBuffer = fs.readFileSync(path.join(__dirname, "assets", "unknown-album.jpg"));
                    sharp(unknownAlbumBuffer).resize(size, size).toFile(filePath);
                }
            });
        } catch (err) {
            console.log("Error writting cover to disk");
        }
    }

    public static async saveFromURL(url: string, artistName: string) {
        try {
            const response = await fetch(url);

            if (!response.ok || !response.body)
                throw new Error(`Failed to fetch: ${response.statusText}`);

            const buffer = await response.arrayBuffer();
            const parsedArtist = new Formmatter(artistName).toDirectoryName();
            const targetPath = path.join(__dirname, "../", "public", "thumbnails", "artist", parsedArtist);
            const urls: string[] = [];
            const sizes = [64, 128, 256, 512, 1200, 1800];

            if (!fs.existsSync(targetPath))
                fs.mkdirSync(targetPath, { recursive: true });

            sizes.forEach(size => {
                let filePath = path.join(targetPath, `photo-${size}.jpg`);
                if (!fs.existsSync(filePath)) {
                    sharp(buffer).resize(size, size).toFile(filePath);
                    urls.push(`thumbnails/artist/photo-${size}.jpg`);
                }
            })

            // Pipe the response body stream to a file system writable stream
            // await pipeline(response.body, fs.createWriteStream(path.join(targetPath, "photo.jpg")));

            return
            console.log(`File successfully saved to ${targetPath}`);
        } catch (error) {
            console.error('Error during file download:', error);
        }
    }
}


