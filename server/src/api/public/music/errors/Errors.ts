export class InvalidParamIdError<T extends Object, U extends string> extends Error {
    constructor(owner: T, value?: U) {
        super(value ? `Invalid ID Error, the value: ${value} is incorrect.` : "Invalid ID Error");
        console.log("Invalid ID Error, at: " + owner.constructor.name);
    }
};

export class InvalidPaginationError<T extends Object, U extends string> extends Error {
    constructor(owner: T, message?: U) {
        super(message || "Invalid Pagination Value");
        console.log("Invalid Pagination Error, at: " + owner.constructor.name);
    }
}

export class ElementNotFoundError<T extends Object, U extends string> extends Error {
    constructor(owner: T, message?: U) {
        super(message || "Element Not Found");
        console.log("Element not Found, at: " + owner.constructor.name);
    }
}
