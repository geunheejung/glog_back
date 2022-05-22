export interface IAccount { id: string, pw: string, userId: string }

export interface IUser { id: string, nickname: string }

interface IPost {
  userId: string;
  thumbnail: string;
  title: string;
  content: string;
  tag: string[];
  date: string;
  commentId: string;
}
export interface IDB {
  account: IAccount[];
  user: IUser[];
  post: IPost[];
}

export const db: IDB = {
  account: [
    {
      id: 't@gmail.com',
      pw: 't',
      userId: '1',
    }
  ],
  user: [
    {
      id: '1',
      nickname: 'geuni',
        
    }
  ],
  post: [
    {
      userId: '1',
      thumbnail: '',
      title: '',
      content: '',
      tag: [''],
      date: '',
      commentId: '1'
    }
  ]
}