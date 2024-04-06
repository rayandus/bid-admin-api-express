import { JwtUser } from '../common/types/express';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { CreateBidItemBody, PlaceBidItemBody, PlaceBidItemParam } from './bid-item.dto';
import BidItemService from './bid-item.service';
import { BidItemStatusEnum } from './bid-item.model';

class BidItemController {
  public static create = async (
    req: Request<unknown, unknown, CreateBidItemBody, unknown, JwtUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};

      const { name, startPrice, expiryDuration, isActive } = req.body;

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      const bidItem = await BidItemService.create({
        userId,
        name,
        startPrice,
        expiryDuration,
        isActive,
        ...(isActive ? { expiryStartDateTime: new Date() } : {}),
        status: BidItemStatusEnum.ONGOING,
      });

      res.json(bidItem);
    } catch (err) {
      next(err);
    }
  };

  public static placeBid = async (
    req: Request<PlaceBidItemParam, unknown, PlaceBidItemBody, unknown, JwtUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};
      const { bidItemId } = req.params;
      const { amount } = req.body;

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      const bidItem = BidItemService.placeBid({
        userId,
        bidItemId,
        amount,
      });

      res.json(bidItem);
    } catch (err) {
      next(err);
    }
  };

  public static list = async (
    req: Request<unknown, unknown, unknown, unknown, JwtUser>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, email } = req.user || {};

      if (!userId) {
        throw createHttpError.NotFound(`User ${email} not found`);
      }

      const list = await BidItemService.list({ userId });

      res.json(list);
    } catch (err) {
      next(err);
    }
  };

  public static listAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const list = await BidItemService.list({ isActive: true });

      res.json(list);
    } catch (err) {
      next(err);
    }
  };
}

export default BidItemController;
