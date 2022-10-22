import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	console.log(request.user);
	if (!request.user.userId) throw new UnauthorizedException();
	return request.user.userId;
});
