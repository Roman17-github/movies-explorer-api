module.exports = class notFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
