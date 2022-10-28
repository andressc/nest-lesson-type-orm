import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
	constructor(userId: string) {
		super({ message: `user id = ${userId} not found`, field: 'userId' });
	}
}
