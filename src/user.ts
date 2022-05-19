import { Request, Response } from 'express'
import { db } from '../mock';
import { sign, refresh } from './jwt-util';
import redisClient, { _redis } from './redis';

export const login = async (req: Request, res: Response) => {
  try {
    const { body: { id, pw } } = req;

    const account = db.account.find((row) => row.id === id && row.pw === pw);
 
    const user = db.user.find((user) => account?.userId === user.id);

    if (user) {
      const accessToken = sign(user);
      const refreshToken = refresh();

      _redis(async () => {
        await redisClient.set(user.id === '1' ? user.id : user.id + 1, refreshToken);
      })

      res.status(200).send({
        ok: true,
        userId: user.id,
        accessToken,
        refreshToken,
      });     
    } 
  } catch (error) {  
    console.log(error);
      
    res.status(401).send({
      ok: false,
      message: error,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { body: { userId } } = req;

    _redis(async () => {
      await redisClient.del(userId)
    });

    res.send({ ok: true });
  } catch (error) {
    res.status(400).send({ ok: false, message: 'failed logout.' })
  }
}

export const user = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = db.user.find((user) => id.toString() === user.id);
    
    res.status(200).send({
      ok: true,
      ...user
    });
  } catch (error) {
    res.status(400).send({
      ok: false,
      message: 'failed get user.',
    });
  }
}