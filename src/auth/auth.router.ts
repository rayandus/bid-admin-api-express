import express, { Router } from 'express';
import joiValidation from 'express-joi-validation';
import AuthController from './auth.controller';
import { loginBodySchema } from './auth.dto';

const validator = joiValidation.createValidator({});

const router: Router = express.Router();

router.route('/login').post(validator.body(loginBodySchema), AuthController.login);

export default router;
