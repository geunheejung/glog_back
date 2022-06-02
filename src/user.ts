import { Request, Response } from 'express';
import { db, IUser } from '../mock';
import { sign, refresh } from './jwt-util';
import redisClient, { _redis } from './redis';

const findUser = async (userId: string): Promise<IUser>  => {
  try {
    const user = await db.user.find((user) => userId === user.id);

    if (!user) throw 'Not Found User';
  
    return user;
  } catch(error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {
      body: { id, pw },
    } = req;

    const account = await db.account.find(
      (row) => row.id === id && row.pw === pw
    );

    if (!account) throw 'Not Found Account';

    const user = await findUser(account.userId);

    const accessToken = sign(user);
    const refreshToken = refresh();

    await _redis(async () => {
      await redisClient.set(
        user.id === '1' ? user.id : user.id + 1,
        refreshToken
      );
    });

    res.send({
      ok: true,
      userId: user.id,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).send({ ok: false, message: error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId },
    } = req;

    await _redis(async () => {
      await redisClient.del(userId);
    });

    res.send({ ok: true });
  } catch (error) {
    res.status(400).send({ ok: false, message: 'failed logout.' });
  }
};

export const user = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await findUser(id.toString());

    res.send({
      ok: true,
      ...user,
    });
  } catch (error) {
    res.status(400).send({
      ok: false,
      message: error,
    });
  }
};

export { 
  findUser
}