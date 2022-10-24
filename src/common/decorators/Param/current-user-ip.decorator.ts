import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUserIp = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	if (!request.ip) throw new UnauthorizedException();
	return request.ip;
});
