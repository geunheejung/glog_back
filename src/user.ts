import { Request, Response } from 'express';

import { sign, refresh } from './jwt-util';
import Account, { IAccount  } from './models/account';
import User, { IUser } from './models/user';
import redisClient, { _redis } from './redis';

export const signUp = async (req: Request, res: Response) => {
  try {
    const {
      body: { nickname, email, pw },
    } = req;

    const account = await Account.findOne({ email }).then((account) => account);
    
    if (account) {
      res.status(400).send({ ok: false, message: '이미 존재하는 계정입니다.' });
      return;
    }

    const { _id } = await Account.create({ nickname, email, pw }).then((result) => result);
    await User.create({ id: _id, nickname, email })    

    res.send({ ok: true, message: '회원가입 완료.' });

  } catch (error) {    
    res.status(400).send({ ok: false, message: '계정 생성 도중 에러가 발생했습니다.' });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const {
      body: { email, pw },
    } = req;

    const account = await Account.findOne<IAccount>({ email, pw }).then((account => account));

    if (!account) throw '비밀번호가 틀렸습니다.';

    const user = await User.findOne({ id: account._id }).then((user) => user) as IUser;

    const accessToken = sign(user);
    const refreshToken = refresh();
    
    await _redis(async () => {
      await redisClient.set(
        user.id,
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

    const user = await User.findOne({ id }).then((user) => user);

    if (!user) throw 'Not Found User';

    res.send({
      ok: true,
      ...user._doc
    });
  } catch (error) {
    res.status(400).send({
      ok: false,
      message: error,
    });
  }
};