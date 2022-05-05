export interface IAccount { id: string, pw: string, userId: string };

export interface IUser { id: string, nickname: string }
export interface IDB {
  account: IAccount[],
  user: IUser[]

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
  ]
}