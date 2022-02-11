module.exports = class conflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
