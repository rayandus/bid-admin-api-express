import { Request } from 'common/types';
import { IUser } from './user.model';
import UserService from './user.service';

class UserController {
  public static getMyProfile = async (req: Request): Promise<IUser | null> => {
    const { userId } = req.user;

    const user = await UserService.findOneById(userId);

    return user;
  };
}

export default UserController;
