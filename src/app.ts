import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { login, logout, signUp, user } from './user';
import refresh from './refresh';
import authJWT from './authJWT';
import { searchPost } from './post';

dotenv.config();

const enum API_PATH {
  SignUp = '/signup',
  Login = '/login',
  Logout = '/logout',
  Refresh = '/refresh',
  User = '/user/:id',
  Search = '/search/:keyword',
}

const app = (() => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT);
  });

  mongoose.connect((process.env.MONGO_URI as string), {
    dbName: 'blog'
  })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

  return app;
})();

app.post(API_PATH.SignUp, signUp)
app.post(API_PATH.Login, login);
app.post(API_PATH.Logout, authJWT, logout);
app.post(API_PATH.Refresh, refresh);
app.get(API_PATH.User, authJWT, user);
app.get(API_PATH.Search, searchPost);
