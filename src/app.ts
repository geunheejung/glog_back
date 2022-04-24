import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import winston, { transports } from 'winston';
import {db} from '../mock';

const enum API_PATH {
  Login = '/login'
}

const PORT = 3095;

const [app, logger] = (() => {
  const app = express();
  const logger  = winston.createLogger({
    transports: [
      new transports.Console()
    ]
  });

  app.use(cors());
  app.use(express.json());

  app.listen(PORT, () => { console.log('listening on port', PORT); });

  return [app,logger];
})();

app.post(API_PATH.Login, (req: Request, res: Response) => {
  try {
    const { body: { id, pw } } = req;
    const account = db.account.find((row) => {
      if (row.id !== id) throw '아이디가 틀렸습니다.'; 
      else if (row.pw !== pw) throw '비밀번호가 틀렸습니다.';
      
        return true;
    });

    const user = db.user.find((user) => account?.userId === user.id );

    res.send(user);     
  } catch (error) {
    res.status(400).send(error);
  }
})



