import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

//Editing "express request" interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

//Middleware take request before it's go to the main logic, and after middleware do it's own logic
// request go further
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session || {};

    if (userID) {
      const user = await this.usersService.findOne(userID);

      req.currentUser = user;
    }

    next(); //go ahead and tun further with request
  }
}
