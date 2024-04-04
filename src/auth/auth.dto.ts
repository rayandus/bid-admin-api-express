import Joi from 'joi';

export interface LoginBodyDto {
  email: string;
  password: string;
}

export const loginBodySchema = Joi.object<LoginBodyDto>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});
