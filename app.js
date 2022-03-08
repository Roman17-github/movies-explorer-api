require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const limiter = require('./utils/limiter');
const centralError = require('./middlewares/centralError');

const app = express();
const { PORT = 3000, NODE_ENV, MONGO } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? MONGO : 'mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
});

app.use(helmet());
app.use(limiter);
app.use(cors);
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralError);

app.listen(PORT);