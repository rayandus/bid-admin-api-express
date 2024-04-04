import express, { Router } from 'express';
import UserController from './user.controller';
import { AuthService } from '../auth';

const router: Router = express.Router();

router.route('/me').get(AuthService.checkAuthorization, UserController.getMyProfile);

export default router;
