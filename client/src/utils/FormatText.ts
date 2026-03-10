export class FormatText {
    private static readonly specialCharsRgx = /[~!@#$%^&*()_+=\[\]{}|\\;:'",<>/?]/g;
    private static readonly whiteSpacesRgx = /[\s\.]/g;
    private static readonly accentsRgx = /[\u0300-\u036f]/g;
    private static readonly doubleDashesRgx = /-{2,}/g;
    private static readonly maskImageRegex = /-webkit-mask-image:.+;/g;
    private static readonly svgRegex = /<svg.+<\/svg>/;

    public static title(title: string): string {
        const cleaned = title.normalize("NFD").replace(FormatText.accentsRgx, "");
        return cleaned.replaceAll(FormatText.specialCharsRgx, "")
            .replaceAll(FormatText.whiteSpacesRgx, "-")
            .replaceAll(FormatText.doubleDashesRgx, "-")
            .toLocaleLowerCase();
    }

    public static formatFileName(title: string) {
        const cleaned = title.normalize("NFD").replace(FormatText.accentsRgx, "");
        return cleaned.replaceAll(FormatText.specialCharsRgx, "")
            .replaceAll(FormatText.whiteSpacesRgx, "-")
            .replaceAll(FormatText.doubleDashesRgx, "-");
    }

    public static toKebabCase(str: string): string {
        return str.toLocaleLowerCase().replaceAll(" ", "-");
    }
    //  -webkit-mask-image: url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8"?><svg id="svg0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><defs><style>.cls-1{fill:none;}.cls-2{fill-rule:evenodd;}</style></defs><rect class="cls-1" width="16" height="16"/><path class="cls-2" d="M8,16c4.42,0,8-3.58,8-8S12.42,0,8,0,0,3.58,0,8s3.58,8,8,8ZM6.07,3.55c-.08,.29-.09,.6-.03,.9l.86,4.56c.05,.28,.2,.52,.42,.7,.22,.18,.49,.28,.77,.28s.55-.1,.77-.28c.22-.18,.36-.43,.42-.7l.86-4.56c.06-.3,.04-.61-.03-.9-.08-.29-.22-.57-.41-.8-.19-.23-.44-.42-.71-.55-.28-.13-.58-.2-.88-.2s-.61,.07-.88,.2c-.28,.13-.52,.32-.71,.55-.19,.23-.34,.51-.41,.8Zm3.07,10.01c.28-.28,.44-.66,.44-1.06s-.16-.78-.44-1.06c-.28-.28-.66-.44-1.06-.44s-.78,.16-1.06,.44c-.28,.28-.44,.66-.44,1.06s.16,.78,.44,1.06c.28,.28,.66,.44,1.06,.44s.78-.16,1.06-.44Z"/></svg>');

    public static EncodeTheme(source: string): string {
        let coincidences = Array.from(source.matchAll(FormatText.maskImageRegex)).map(coincidence => coincidence[0]);

        if (coincidences.length > 0) {
            let encodedTheme = coincidences.reduce((prev, curr) => {
                //find a svg in webkit prop
                let svg = curr.match(FormatText.svgRegex)![0];
                //encode the svg 
                let encodedSvg = encodeURIComponent(svg);
                //replace in the original source
                return prev.replace(svg, encodedSvg);
            }, source);
            return encodedTheme;
        }

        return source;
    }

    public static SanitizePath(source: string) {
        return source.replaceAll("\\", "/");
    }
}


export class TextUtils {
    private str: string;
    constructor(str: string) {
        this.str = str;
    }

    /**
     * removes accents and normalizes the given string
     * @returns 
     */
    sanitize() {
        this.str = this.str.normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "")
        return this;
    }

    removeSpecialChars() {
        this.str = this.str.replaceAll(/[~!@#$%^&*()_–+=\[\]{}|\\;:'",<>/?]/g, " ")
        return this;
    }

    removeDots() {
        this.str = this.str.normalize("NFD").replaceAll(/\./g, " ")
        return this;
    }

    removeDoubleDashes() {
        this.str = this.str.replaceAll(/-{2,}/g, "")
        return this;
    }

    removeWhiteSpaces() {
        this.str = this.str.replaceAll(" ", "");
        return this;
    }

    removeDashes() {
        this.str = this.str.replaceAll("-", "")
        return this;
    };

    removeNonASCII() {
        this.str = this.str.replaceAll(/[^\x00-\x7F]/gm, "")
        return this;
    }

    removeLateralWhiteSpaces() {
        this.str = this.str.replace(/^ /, "").replace(/ $/, "");
        return this;
    }

    normalizeWhiteSpaces() {
        this.str = this.str.replace(/^ /, "").replace(/ $/, "").replaceAll(/\s{2,}/g, " ")
        return this;
    }

    toKebabCase() {
        this.str = this.str.replaceAll(" ", "-").replaceAll(/-{2,}/g, "-");
        return this;
    }

    get() {
        return this.str;
    }

    toDirectoryName() {
        return this
            .sanitize()
            .removeSpecialChars()
            .removeDots()
            .normalizeWhiteSpaces()
            .toKebabCase()
            .get()
            .toLocaleLowerCase()
    }

    public static toKebabCase(str: string) {
        return new TextUtils(str).toDirectoryName();
    }
} 