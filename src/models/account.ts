import mongoose, { Schema } from 'mongoose';
import User, { IUser } from './user';

const { Types: { ObjectId } } = Schema;

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pw: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IAccount {
  _id: string;
  nickname: string;
  email: string;
  pw: string;
}

accountSchema.statics.create = function (payload: IAccount) {
  const account = new this(payload);
  return account.save();
};

const Account = mongoose.model('Account', accountSchema);

export default Account;