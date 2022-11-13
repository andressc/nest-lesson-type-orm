import { NotFoundException } from '@nestjs/common';

export class LikeNotFoundException extends NotFoundException {
	constructor(itemId: string) {
		super({
			message: `like itemId = ${itemId} not found`,
			field: 'itemId',
		});
	}
}
