import scrapeIt from "scrape-it";
import { LastFMScrapedArtistMetadata, OrderedArtist } from "../types/types";
import { Formmatter } from "../utils/FormatText";
import { fetchFromPage } from "./FetchData";
import cliProgress, { SingleBar } from "cli-progress";


export class LFMScrapper {
    private static async fetchArtist(artist: string): Promise<LastFMScrapedArtistMetadata | null> {
        let artistParam = new Formmatter(artist).sanitize().removeNonASCII().normalizeWhiteSpaces().get();
        let opts: scrapeIt.ScrapeOptions = {
            artist: {
                selector: "h1"
            },
            bio: {
                listItem: ".wiki-content p",
            },
            cover: {
                selector: ".header-new-background-image",
                attr: "content"
            },
            colorCode: {
                selector: ".header-new-inner",
                attr: "style",
                convert: color => color.replace("background: ", "")
            },
            activeYears: {
                selector: ".factbox>li:nth-child(1) p"
            },
            location: {
                selector: ".factbox>li:nth-child(2) p"
            },
            members: {
                listItem: ".factbox>li:nth-child(3) li",
            }
        };
        let result = await fetchFromPage<LastFMScrapedArtistMetadata>(
            `https://www.last.fm/music/${encodeURI(artistParam)}/+wiki`,
            opts,
            5
        );
        return result;
    }


    public static async scrapeArtists(artists: OrderedArtist[]) {
        const progressBar = new cliProgress.SingleBar({ format: '{value}/{total} | ETA: {eta}s ' });
        const start = Date.now();

        console.log("Scraping Artist Photo");
        // progressBar.start(artists.length, 0);

        for (let artist of artists) {
            // await ScrapeCover.saveFromURL(artist.details.photo.replace("500x500", "1800x1800"), artist.name)
            // progressBar.increment(1);
            const artistMeta = await LFMScrapper.fetchArtist(artist.name);
            console.log("-----------------------------")
            console.log(artistMeta)
            console.log()
        }

        // progressBar.stop();
        console.log(`Scraped ${artists.length} photos in: ${((Date.now() - start) / 1000)} secs.`)
        console.log()
    }
}


