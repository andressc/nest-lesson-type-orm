import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const TokenDecorator = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	if (!request.header('authorization')) throw new UnauthorizedException();
	return {
		userId: request.user.userId,
		deviceId: request.user.deviceId,
		lastActiveDate: request.user.lastActiveDate,
		userAgent: request.user.userAgent,
		ip: request.user.ip,
	};
});
