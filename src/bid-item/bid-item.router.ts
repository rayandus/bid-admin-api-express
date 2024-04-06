import express, { Router } from 'express';
import { AuthService } from '../auth';
import BidItemController from './bid-item.controller';
import { validate } from 'express-validation';
import { placeBidItemBodySchema, placeBidItemParamSchema } from './bid-item.dto';

const router: Router = express.Router();

router.route('/').get(AuthService.checkAuthorization, BidItemController.create);

router
  .route('/:bidItemId')
  .put(
    AuthService.checkAuthorization,
    validate({ params: placeBidItemParamSchema, body: placeBidItemBodySchema }),
    BidItemController.placeBid,
  );

router.route('/').get(AuthService.checkAuthorization, BidItemController.list);

router.route('/all').get(AuthService.checkAuthorization, BidItemController.listAll);

export default router;
