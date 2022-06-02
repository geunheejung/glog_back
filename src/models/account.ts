import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  pw: { type: String, required: true },
  userId: { type: String, required: true, unique: true }
});

interface IPayload {
  id: string;
  pw: string;
  userId: string;
}

accountSchema.statics.create = function (payload: IPayload) {
  // this === Model
  const todo = new this(payload);
  // return Promise
  return todo.save();
};

const Account = mongoose.model('Account', accountSchema);

export default Account;