import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//never say, you cannot pass that argument to function
export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.currentUser; // get userData saved there by current-user.interceptor.ts
});
