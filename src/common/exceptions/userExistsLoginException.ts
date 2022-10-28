import { BadRequestException } from '@nestjs/common';

export class UserExistsLoginException extends BadRequestException {
	constructor(login: string) {
		super([
			{
				message: `user login = ${login} already exists`,
				field: 'login',
			},
		]);
	}
}
