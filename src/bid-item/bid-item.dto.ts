import Joi from 'joi';
import { BidItem } from './bid-item.model';

export interface CreateBidItemBody
  extends Pick<BidItem, 'name' | 'startPrice' | 'expiryDuration'> {
  isActive: boolean;
}

export const createBidItemBodySchema = Joi.object<CreateBidItemBody>({
  name: Joi.string().required(),
  startPrice: Joi.number().greater(0).required(),
  expiryDuration: Joi.object({
    days: Joi.number().min(0),
    hours: Joi.number().min(0).max(24),
    minutes: Joi.number().min(0).max(60).required(),
  }).required(),
  isActive: Joi.boolean().required(),
}).options({
  abortEarly: false,
});

export interface PlaceBidItemParam {
  bidItemId: string;
  [key: string]: string;
}

export const placeBidItemParamSchema = Joi.object<PlaceBidItemParam>({
  bidItemId: Joi.string().required(),
});

export interface PlaceBidItemBody {
  amount: number;
}

export const placeBidItemBodySchema = Joi.object<PlaceBidItemBody>({
  amount: Joi.number().greater(0).required(),
});
