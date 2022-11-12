import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserIdNonAuthorized = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		if (!request.user?.userId) return { id: null };
		return { id: request.user.userId };
	},
);
