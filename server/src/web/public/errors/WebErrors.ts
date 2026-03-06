export class WebInvalidParamsError<T extends Object, U extends string> extends Error {
    constructor(owner: T, paramName: U, paramValue: U) {
        super(`Params Error at: ${paramName} with value:  ${paramValue}`)
        console.log("Invalid Param, Error at" + owner.constructor.name);
    }
};

export class FileNotFoundError<T extends Object, U extends string> extends Error {
    constructor(owner: T, fileName: U) {
        super(`File: ${fileName}, Not Found`);
        console.log(`File ${fileName} Not Found, at: ${owner.constructor.name}`);
    }
};