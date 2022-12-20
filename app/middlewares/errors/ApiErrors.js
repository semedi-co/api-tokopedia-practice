const BaseError = require("./BaseError");

// Bad Request
class Api400Error extends BaseError {
    constructor(message, detail = []) {
        super(400, message, detail);
    }
}

// Unauthorized
class Api401Error extends BaseError {
    constructor(message, detail = []) {
        super(401, message, detail);
    }
}

// 
class Api403Error extends BaseError {
    constructor(message, detail = []) {
        super(403, message, detail);
    }
}

class Api404Error extends BaseError {
    constructor(message, detail = []) {
        super(404, message, detail);
    }
}

class Api422Error extends BaseError {
    constructor(message, detail = []) {
        super(422, message, detail);
    }
}

module.exports = { Api400Error, Api401Error, Api403Error, Api404Error, Api422Error };
