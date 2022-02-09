module.exports = class authError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
};