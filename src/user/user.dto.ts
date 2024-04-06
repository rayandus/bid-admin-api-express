import Joi from 'joi';

export interface UserBody {
  email: string;
  password: string;
}

export const userBodySchema = Joi.object<UserBody>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});
