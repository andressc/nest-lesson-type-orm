import { ForbiddenException } from '@nestjs/common';

export class UserExistsException extends ForbiddenException {
	constructor(login: string, email: string) {
		super({
			message: `user login = ${login} or email = ${email} already exists`,
			field: ['email', 'login'],
		});
	}
}
