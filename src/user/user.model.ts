import { Model, Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const transformResult = (_doc: IUser, ret: Record<string, unknown>): void => {
  delete ret.password;
};

export interface User {
  email: string;
  password: string;
  isLoggedIn: boolean;
}

export interface IUser extends User, Document {}

interface IUserModel extends Model<IUser> {}

export const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    isLoggedIn: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true, transform: transformResult },
    toObject: { virtuals: true, transform: transformResult },
  },
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

UserSchema.index({ email: 1 }, { unique: true });

const UserModel = model<IUser, IUserModel>('users', UserSchema);

export default UserModel;
