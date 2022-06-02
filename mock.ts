export interface IAccount {
  id: string;
  pw: string;
  userId: string;
}

export interface IUser {
  id: string;
  nickname: string;
}

interface IPost {
  id: string;
  userId: string;
  thumbnail: string;
  title: string;
  content: string;
  tag: string[];
  date: string;
  commentId: string;
}

interface IComment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  date: string;
}

export interface IDB {
  account: IAccount[];
  user: IUser[];
  post: IPost[];
  comment: IComment[];
}

export const db: IDB = {
  account: [
    {
      id: 't@gmail.com',
      pw: 't',
      userId: '1',
    },
  ],
  user: [
    {
      id: '1',
      nickname: 'geuni',
    },
  ],
  post: [
    {
      id: '1',
      userId: '1',
      thumbnail: '',
      title: '',
      content: '',
      tag: [''],
      date: '',
      commentId: '1',
    },
  ],
  comment: [
    {
      id: '1',
      userId: '1',
      postId: '1',
      content: '',
      date: '',
    },
  ],
};
