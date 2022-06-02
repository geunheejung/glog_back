import { Request, Response } from 'express';
import { db } from '../mock';
/**
 * search post
 */

export const searchPost = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.params;
    const postList = db.post.filter((post) => post.title.includes(keyword));

    if (!postList.length) {
      res.status(204).send({ ok: true, list: [] });
    }

    res.send({ ok: true, list: postList });
  } catch (err) {
    res.status(400).send({ ok: false, err: '잘못된 요청 입니다.' });
  }
};
