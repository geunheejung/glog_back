import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import redisClient from './redis';
import { IUser } from '../mock';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET as string;

export const sign = (user: IUser) => {
  const payload = { id: user.id };

  const token = jwt.sign(payload, secret, { 
    algorithm: 'HS256',
    expiresIn: '1h',
  });

  return token;
}

export const verify = (token: string) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    
    return {
      ok: true,
      id: decoded.id,
    };
  } catch (err: any) {
    console.log(err);
    
    return {
      ok: false,
      message: err.message
    }
  }
}

export const refresh = () => {
  return jwt.sign({}, secret, { algorithm: 'HS256', expiresIn: '14d' });
}

export const refreshVerify = async (token: string, userId: string | null) => {
   /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
  const getAsync = promisify(redisClient.get).bind(redisClient);

  try {
    const data = await getAsync(userId);
    if (token === data) {
      try {
        jwt.verify(token, secret);
        return { ok: true };
      } catch (err) {
        return { ok: false };
      }
    } else {
      return { ok: false };
    }
  } catch (err) {
    return { ok: false };
  }
}