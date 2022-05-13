import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { login, user } from './user';
import refresh from './refresh';
import authJWT from './authJWT';

dotenv.config();

const enum API_PATH {
  Login = '/login',
  Refresh = '/refresh',
  User = '/user/:id',
}

const app = (() => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.listen(process.env.PORT, () => { console.log('listening on port', process.env.PORT); });

  return app;
})();

app.post(API_PATH.Login, login);
app.post(API_PATH.Refresh, refresh);
app.get(API_PATH.User, authJWT, user);