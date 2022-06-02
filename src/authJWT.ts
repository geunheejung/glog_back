import { NextFunction, Request, Response } from 'express';
import { verify } from './jwt-util';

const authJWT = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('Bearer ')[1]; // header에서 access token get

    const result = verify(token);
    if (result.ok) { // token 검증 -> req에 값  세팅, 다음 콜백함수로
      req.userId = result.id;
      next();
    } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답
      res.status(401).send({
        ok: false,
        message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  } else {  
    res.status(401).send({
      ok: false,
      message: 'Invalid Token'
    });
  }

  
}

export default authJWT;