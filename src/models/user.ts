import mongoose, { Schema } from 'mongoose';

const { Types: { ObjectId } } = Schema;

const userSchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true, ref: 'Account' },
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IUser {
  id: string;
  email: string;
  nickname: string;
}

userSchema.statics.create = function (payload: IUser) {  
  const user = new this(payload);
  return user.save();
};

const User = mongoose.model('User', userSchema);

export default User;