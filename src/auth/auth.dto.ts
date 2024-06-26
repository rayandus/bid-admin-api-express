import Joi from 'joi';

export interface LoginBodyDto {
  email: string;
  password: string;
  hello: Record<string, string>;
}

export const loginBodySchema = Joi.object<LoginBodyDto>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});
