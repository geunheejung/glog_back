import { Request, Response } from 'express'
import { db } from '../mock';
import { sign, refresh } from './jwt-util';
import redisClient from './redis';

export const login = async (req: Request, res: Response) => {
  try {
    const { body: { id, pw } } = req;

    const account = db.account.find((row) => row.id === id && row.pw === pw);
 
    const user = db.user.find((user) => account?.userId === user.id);

    if (user) {
      const accessToken = sign(user);
      const refreshToken = refresh();

      await redisClient.connect();

      await redisClient.set(user.id, refreshToken);

      res.status(200).send({
        ok: true,
        accessToken,
        refreshToken,
      });     
    } 
  } catch (error) {    
    res.status(401).send({
      ok: false,
      message: error,
    });
  }
};

export const user = (req: Request, res: Response) => {
  try {
    res.status(200).send('hello');
  } catch (error) {
    res.status(401).send({
      ok: false,
      message: 'user is incorrect',
    });
  }
}