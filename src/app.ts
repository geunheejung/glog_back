import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { login, user } from './user';
import refresh from './refresh';
import authJWT from './authJWT';

dotenv.config();

const enum API_PATH {
  Login = '/login',
  Refresh = '/refresh',
  User = '/user',
}

const app = (() => {
  const app = express();

  const sessionInfo: session.SessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
    name: 'sessionId',
    cookie: {
      httpOnly: false,
      secure: false,
    },
  }

  app.use(cors());
  app.use(express.json());
  // app.use(session(sessionInfo));

  app.listen(process.env.PORT, () => { console.log('listening on port', process.env.PORT); });

  return app;
})();

app.post(API_PATH.Login, login);
app.post(API_PATH.Refresh, refresh);
app.get(API_PATH.User, authJWT, user);