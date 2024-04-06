import Joi from 'joi';

export interface DepositBody {
  amount: number;
}

export const depositBodySchema = Joi.object<DepositBody>({
  amount: Joi.number().greater(0).required(),
}).options({
  abortEarly: false,
});
