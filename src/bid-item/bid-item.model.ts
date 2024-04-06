import { Model, Types, Schema, Document, model } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface ExpiryDuration {
  days?: number;
  hours?: number;
  minutes: number;
}

export interface CurrentBid {
  userId: string;
  amount: number;
}

export enum BidItemStatusEnum {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export interface BidItem {
  userId: Types.ObjectId | string;
  name: string;
  startPrice: number;
  currentBid?: CurrentBid;
  isActive: boolean;
  status: BidItemStatusEnum;
  expiryDuration: ExpiryDuration;
  expiryStartDateTime?: Date;
}

export interface IBidItem extends BidItem, Document {
  currentPrice: number;
}

interface IBidItemModel extends Model<IBidItem> {}

export const BidItemSchema = new Schema<IBidItem, IBidItemModel>(
  {
    userId: { type: ObjectId, required: true },
    name: { type: String, require: true },
    startPrice: { type: Number, required: true },
    currentBid: {
      type: {
        userId: { type: String, required: true },
        amount: { type: Number, required: true },
      },
      _id: false,
    },
    isActive: {
      type: Boolean,
      requird: true,
    },
    status: {
      type: String,
      enum: Object.values(BidItemStatusEnum),
      default: BidItemStatusEnum.ONGOING,
      required: true,
    },
    expiryDuration: {
      type: {
        days: { type: Number, required: false },
        hours: { type: Number, required: false },
        minutes: { type: Number, required: true },
      },
      _id: false,
      required: true,
    },
    expiryStartDateTime: { type: Date },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

BidItemSchema.virtual('currentPrice').get(function deriveCurrentPrice(): number {
  const { amount = 0 } = this.currentBid || {};

  return amount || this.startPrice;
});

BidItemSchema.virtual('currentExpiryDuration').get(
  function deriveCurrentExpiryDuration(): ExpiryDuration {
    const { days = 0, hours = 0, minutes } = this.expiryDuration;
    const expirtStartDateTime = this.expiryStartDateTime?.getTime() || Date.now();

    const totalExpiryDuration = days * 24 * 60 + hours * 60 + minutes;

    const elapsedTime = (Date.now() - expirtStartDateTime) / 1000 / 60;

    const updatedExpiryDuration = totalExpiryDuration - elapsedTime;

    const updatedDays = Math.floor(updatedExpiryDuration / (60 * 24));
    const updatedHours = Math.floor((updatedExpiryDuration % (60 * 24)) / 60);
    const updatedMinutes = Math.floor(updatedExpiryDuration % 60);

    return {
      days: updatedDays,
      hours: updatedHours,
      minutes: updatedMinutes,
    };
  },
);

const BidItemModel = model<IBidItem, IBidItemModel>('bid-item', BidItemSchema);

export default BidItemModel;
