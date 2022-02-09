const jwtverify = require('jsonwebtoken');
const authError = require('../errors/authError');

module.exports = (req, res, next) => {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const { jwt } = req.cookies;

    if (!jwt) {
        throw new authError('Необходима авторизация');
    }

    let payload;

    try {
        payload = jwtverify.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
        next(new authError('Необходима авторизация'));
    }
    req.user = payload;
    next();
}