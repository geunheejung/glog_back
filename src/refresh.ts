import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../mock';
import { refreshVerify, sign, verify } from './jwt-util';

const refresh = async (req: Request, res: Response) => {
  const { body: { id, pw } } = req;
  const account = db.account.find((row) => row.id === id && row.pw === pw);
  const user = db.user.find((user) => account?.userId === user.id);

  if (!user) {
    res.status(401).send({ ok: false, message: 'Not Found User' });
    return;
  }
  
  // access token과 refresh token의 존재 유무를 체크
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh as string;

    const authResult = verify(authToken);

    const decoded = jwt.decode(authToken);

    // 디코딩 결과  없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(401).send({ ok: false, message: 'No authorized' });
    }

    // access token의 decoding 된 값에서 유저의 id를 가져와 refresh token를 검증
    
    const refreshResult = await refreshVerify(refreshToken, ((decoded) as jwt.JwtPayload).id);

    if (authResult.ok === false && authResult.message === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인
      if (refreshResult.ok === false) {
        res.status(401).send({ ok: false, message: 'No authorized' });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token 발급
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
}

export default refresh;