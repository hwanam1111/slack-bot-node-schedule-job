import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import session from 'express-session';

import logger from '../config/winston';
import schedule from './schedule'; 

dotenv.config();

const { COOKIE_SECRET, NODE_ENV, REDIS_HOST, REDIS_DB, REDIS_PORT, SERVER_PORT } = process.env;

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: COOKIE_SECRET,
    proxy: NODE_ENV === 'production',
    cookie: {
      maxAge: 3600000 * 24 * 365,
      httpOnly: true,
      secure: NODE_ENV === 'production',
      domain: undefined
    },
  }),
);
app.use(schedule);

http.createServer(app).listen(SERVER_PORT, () => {
  if (process.send) {
    process.send('ready');
  }

  logger.info('Start server');
});
