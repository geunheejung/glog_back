import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { refreshVerify, sign, verify } from './jwt-util';
import User, { IUser } from './models/user';

const refresh = async (req: Request, res: Response) => {
  try {
    // access token과 refresh token의 존재 유무를 체크
    if (req.headers.authorization && req.headers.refresh) {
      const authToken = req.headers.authorization.split('Bearer ')[1];
      const refreshToken = req.headers.refresh as string;
      
      const authResult = await verify(authToken);
      const decoded = await jwt.decode(authToken) as jwt.JwtPayload;
    
      // 디코딩 결과  없으면 권한이 없음을 응답.
      if (decoded === null) {
        res.status(401).send({ ok: false, message: 'No authorized' });
      }

      // access token의 decoding 된 값에서 유저의 id를 가져와 refresh token를 검증
      const refreshResult = await refreshVerify(refreshToken, decoded.id);
      
      if (authResult.ok === false && authResult.message === 'jwt expired') {
        // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인
        if (refreshResult.ok === false) {
          res.status(401).send({ ok: false, message: 'Token expired && No authorized' });
        } else {
          // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token 발급
          const user = await User.findOne<IUser>({ _id: decoded.id }).then((user) => user) as 
          IUser;
          const newAccessToken = sign(user);

          res.status(200).send({ ok: true, data: { 
            accessToken: newAccessToken,
            refreshToken
          } });
        }
      } else {
        res.status(400).send({ ok: false, message: 'Access token is not expired!' });
      } 
    } else {
      // 3. access token이 만료되지 않은 경우 => refresh 할 필요가 없다.
      res.status(400).send({ ok: false, message: 'Access token and refresh token are need for refresh!' });
    }
  } catch (error) {
    res.status(400).send({ ok: false, message: 'No authorized' });
  }
  
}

export default refresh;