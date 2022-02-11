module.exports = class InvalidLoginError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
