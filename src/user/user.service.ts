import UserModel, { IUser } from './user.model';

export default class UserService {
  public static findOne = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({ email });
  };

  public static findOneById = async (id: string): Promise<IUser | null> => {
    return await UserModel.findOne<IUser>({ _id: id });
  };

  public static getUserWithPasswordHash = async (
    email: string,
  ): Promise<IUser | null> => {
    try {
      const user = await UserModel.findOne({ email }).select('+password');

      return user as IUser;
    } catch {
      return null;
    }
  };
}
