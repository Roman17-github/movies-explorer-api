module.exports = class validationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
