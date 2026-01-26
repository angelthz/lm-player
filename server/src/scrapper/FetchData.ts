import scrapeIt from "scrape-it";

export async function fetchFromAPI<T>(url: string, uMethod?: string, uHeader?: HeadersInit, body?: Record<string, unknown>) {
    const resp = await fetch(url, {
        headers: uHeader ? new Headers(uHeader) : {},
        body: JSON.stringify(body),
        method: uMethod || "GET"
    });
    if (!resp.ok) throw { error: resp.status, msg: resp.text };
    let json = await resp.json();
    return json as T;
}


export async function fetchFromPage<T>(url: string, opts: scrapeIt.ScrapeOptions, attemps: number): Promise<T | null> {
    try {
        if (attemps > 0) {
            const { data, status } = await scrapeIt(url, opts);
            console.log(url, " ", status)
            return data as T;
        }
        else return null;
    } catch (err) {
        // console.log("Error retrying to fetch");
        return fetchFromPage(url, opts, attemps - 1)
    }
}
