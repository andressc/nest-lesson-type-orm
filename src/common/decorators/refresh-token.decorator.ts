import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const RefreshToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	if (!request.user.refreshToken) throw new UnauthorizedException();
	return {
		refreshToken: request.user.refreshToken,
	};
});
