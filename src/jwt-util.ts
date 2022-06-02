import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import redisClient, { _redis } from './redis';
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
    return {
      ok: false,
      message: err.message
    }
  }
}

export const refresh = () => {
  return jwt.sign({}, secret, { algorithm: 'HS256', expiresIn: '14d' });
}

export const refreshVerify = async (token: string, userId: string) => {
  redisClient.connect();
  const data = await redisClient.get(userId);
  redisClient.disconnect();

  if (token !== data) return { ok: false };
  
  try {
    jwt.verify(token, secret);
    return {
      ok: true
    }
  } catch (err) {
    return { ok: false }
  }
  
}