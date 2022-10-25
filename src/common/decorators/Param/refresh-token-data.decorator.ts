import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const RefreshTokenData = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	if (!request.user) throw new UnauthorizedException();
	return {
		userId: request.user.userId,
		deviceId: request.user.deviceId,
		lastActiveDate: request.user.lastActiveDate,
		userAgent: request.user.userAgent,
		ip: request.user.ip,
	};
});
