module.exports = class BaseError extends Error {
    constructor(statusCode, message, detail) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
        this.detail = detail;
    }
}