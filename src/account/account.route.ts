import express, { Router } from 'express';
import AccountController from './account.controller';
import { AuthService } from '../auth';

const router: Router = express.Router();

router.route('/deposit').post(AuthService.checkAuthorization, AccountController.deposit);

router
  .route('/balance')
  .post(AuthService.checkAuthorization, AccountController.getBalance);

export default router;
