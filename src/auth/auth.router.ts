import express, { Router } from 'express';
import { validate } from 'express-validation';
import AuthController from './auth.controller';
import { loginBodySchema } from './auth.dto';
import AuthService from './auth.service';

const router: Router = express.Router();

router.route('/login').post(validate({ body: loginBodySchema }), AuthController.login);

router.route('/logout').post(AuthService.checkAuthorization, AuthController.logout);

export default router;
