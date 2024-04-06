import { Request as ExpressRequest } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface JwtUser extends JwtPayload {
  email: string;
  userId: string;
}

declare module 'express' {
  interface Request extends ExpressRequest {
    startHrTime?: [number, number];
    user?: JwtUser;
  }
}

declare module 'express-serve-static-core' {
  export interface Request {
    startHrTime?: [number, number];
    user?: JwtUser;
  }
}
