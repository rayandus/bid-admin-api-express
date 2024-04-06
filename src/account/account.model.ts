import { Model, Types, Schema, Document, model } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface Account {
  userId: Types.ObjectId;
  currency: string;
  amount: number;
}

export interface IAccount extends Account, Document {}

interface IAccountModel extends Model<IAccount> {
  updateBalance: ({
    userId,
    currency,
    amount,
    mode,
  }: {
    userId: string;
    currency: string;
    amount: number;
    mode: 'add' | 'minus';
  }) => Promise<Account | null>;
}

export const AccountSchema = new Schema<IAccount, IAccountModel>({
  userId: { type: ObjectId, required: true },
  currency: { type: String, require: true },
  amount: { type: Number, required: true },
});

AccountSchema.statics = {
  async updateBalance({
    userId,
    currency,
    amount,
    mode,
  }: {
    userId: string;
    currency: string;
    amount: number;
    mode: 'add' | 'minus';
  }): Promise<
    Document<unknown, unknown, IAccount> &
      IAccount & {
        _id: Types.ObjectId;
      }
  > {
    const filterQuery = { userId: userId };
    const operation =
      mode === 'add' ? { $inc: { amount } } : { $inc: { amount: amount * -1 } };
    const updateQuery = { userId, currency, ...operation };

    return this.findOneAndUpdate(filterQuery, updateQuery, {
      new: true,
      upsert: true,
    }).exec();
  },
};

const AccountModel = model<IAccount, IAccountModel>('account', AccountSchema);

export default AccountModel;
