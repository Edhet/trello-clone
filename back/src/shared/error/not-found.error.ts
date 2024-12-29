export default class NotFoundError extends Error {
    readonly STATUS_CODE = 404

    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}