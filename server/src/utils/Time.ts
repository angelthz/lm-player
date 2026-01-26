export class Time {
    //convert seconds to individual unit
    public static toMins(time: number) {
        return Math.floor((time / 60));
    }

    public static toSecs(time: number) {
        return Math.floor(time % 60);
    }

    public static toCens(time: number) {
        return Number.parseFloat((time % 1).toFixed(2));
    }

    //format a time in secs to prefix zero notation
    public static formatMM(time: number) {
        return Time.toMins(time) < 10 ? `0${Time.toMins(time)}` : `${Time.toMins(time)}`;
    }

    public static formatSS(time: number) {
        return Time.toSecs(time) < 10 ? `0${Time.toSecs(time)}` : `${Time.toSecs(time)}`;
    }

    public static formatCC(time: number) {
        return Time.toCens(time) === 0 ? "00" : Time.toCens(time).toFixed(2).replaceAll(/0|\./g, "");
    }

    private static isValidTMS(tms: string) {
        if (tms.match(/\[\d+:\d+.\d+\]/) || tms.match(/\d+:\d+.\d+/))
            return true;
        else
            return false;
    }

    /**
      * Format a time in seconds to string representation in format: mm:ss.cc
      * @param time 
      * @returns 
    */
    public static toFullTMS(time: number) {
        return `${Time.formatMM(time)}:${Time.formatSS(time)}.${Time.formatCC(time)}`;
    }

    /**
      * Format a time in seconds to string representation in format: mm:ss
      * @param time 
      * @returns 
    */
    public static toShortTMS(time: number) {
        return `${Time.formatMM(time)}:${Time.formatSS(time)}`;
    }

    /**
      * Parse a timestamp in format mm:ss.cc to get the minutes
      * @param tms 
      * @returns number
    */
    public static parseMM(tms: string) {
        if (Time.isValidTMS(tms)) {
            let secs = Time.parse(tms);
            return Time.toMins(secs);
        }
        else
            return -1;
    }
    /**
     * Parse a timesatamp in format mm:ss.cc to get seconds
     * @param tms string
     * @returns number
     */
    public static parseSS(tms: string) {
        if (Time.isValidTMS(tms)) {
            let secs = Time.parse(tms);
            return Time.toSecs(secs);
        }
        else
            return -1;
    }

    /**
     * Parse a timesatamp in format mm:ss.cc to get cents of seconds
     * @param tms string
     * @returns number
     */
    public static parseCC(tms: string) {
        if (Time.isValidTMS(tms)) {
            let secs = Time.parse(tms);
            return Time.toCens(secs);
        }
        else
            return -1;
    }

    /**
     * Convert a time string in format mm:ss.cc to numeric representation in seconds
     * @param timeStr 
     * @returns number
     */
    public static parse(tms: string) {
        let cleanTMS = tms.replaceAll(/\[|\]/g, "");

        let [mm, ss, cc] = cleanTMS.split(/:|\./).map(t => Number.parseInt(t))

        return (mm ? mm * 60 : 0) + (ss ? ss : 0) + (cc ? (cc > 100 ? cc / 1000 : cc / 100) : 0);
    }
}