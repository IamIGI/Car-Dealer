import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userID } = request.session || {};

    //if this is logged user request, then save user data to property
    if (userID) {
      const user = await this.userService.findOne(userID);
      request.currentUser = user;
    }

    return handler.handle(); // go ahead and run actual route handler
  }
}
