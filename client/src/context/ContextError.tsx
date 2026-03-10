export default class ContextError extends Error {
    constructor(name: string) {
        super(`at ${name}, useGetComplexObject must be used within a Provider`);
    }
}