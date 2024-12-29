export default class BadRequestError extends Error {
    readonly STATUS_CODE = 400

    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}