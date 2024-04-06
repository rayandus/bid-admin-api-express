import createHttpError from 'http-errors';
import BidItemModel, { BidItem, IBidItem } from './bid-item.model';
import AccountService from 'account/account.service';

class BidItemService {
  public static create = async (data: BidItem): Promise<IBidItem> => {
    const item = new BidItemModel(data);

    return item.save();
  };

  public static placeBid = async ({
    userId,
    bidItemId,
    amount,
  }: {
    userId: string;
    bidItemId: string;
    amount: number;
  }): Promise<IBidItem> => {
    const bidItem = await BidItemModel.findById(bidItemId);

    if (!bidItem) {
      throw createHttpError.NotFound(`Bid Item ${bidItemId} not found`);
    }

    const { currentPrice, currentBid } = bidItem;

    if (currentPrice >= amount) {
      throw createHttpError.UnprocessableEntity(
        `Bid Item ${bidItemId} amount is insufficient`,
      );
    }

    const balance = await AccountService.getBalance(userId);
    const balanceAmount = balance?.amount || 0;

    if (balanceAmount < currentPrice) {
      throw createHttpError.UnprocessableEntity('Balance is insufficient');
    }

    if (currentBid) {
      await AccountService.refund({
        userId: currentBid.userId,
        amount: currentBid.amount,
      });
    }

    await AccountService.deductBalance({ userId, amount });

    bidItem.currentBid = {
      userId,
      amount,
    };

    return await bidItem.save();
  };

  public static list = async ({
    isActive,
    userId,
  }: {
    isActive?: boolean;
    userId?: string;
  }): Promise<IBidItem[]> => {
    const filters = {
      ...(userId ? { userId } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    };

    return await BidItemModel.find(filters);
  };
}

export default BidItemService;
