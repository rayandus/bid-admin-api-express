import config from '../common/config';
import AccountModel, { Account } from './account.model';

class AccountService {
  public static addBalance = async ({
    userId,
    currency = config.CURRENCY,
    amount,
  }: {
    userId: string;
    currency?: string;
    amount: number;
  }): Promise<Account | null> => {
    const updatedBalance = await AccountModel.updateBalance({
      userId,
      currency,
      amount,
      mode: 'add',
    });

    return updatedBalance;
  };

  public static deductBalance = async ({
    userId,
    currency = config.CURRENCY,
    amount,
  }: {
    userId: string;
    currency?: string;
    amount: number;
  }): Promise<Account | null> => {
    const updatedBalance = await AccountModel.updateBalance({
      userId,
      currency,
      amount,
      mode: 'minus',
    });

    return updatedBalance;
  };

  public static refund = async ({
    userId,
    currency = config.CURRENCY,
    amount,
  }: {
    userId: string;
    currency?: string;
    amount: number;
  }): Promise<Account | null> => {
    const updatedBalance = await AccountModel.updateBalance({
      userId,
      currency,
      amount,
      mode: 'add',
    });

    return updatedBalance;
  };

  public static getBalance = async (userId: string): Promise<Account | null> => {
    return AccountModel.findOne({ userId });
  };
}

export default AccountService;
