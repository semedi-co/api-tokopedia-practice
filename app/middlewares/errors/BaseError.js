module.exports = class BaseError extends Error {
    constructor(statusCode, message, detail) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.detail = detail;
    }
};