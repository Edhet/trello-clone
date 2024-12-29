export default class UnauthorizedError extends Error {
    readonly STATUS_CODE = 401

    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}