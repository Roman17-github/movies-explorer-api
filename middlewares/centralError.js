module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const { message } = err;
  res.status(status).send(status === 500 ? { error: 'Ошибка на сервере' } : { error: message });
  next();
};
