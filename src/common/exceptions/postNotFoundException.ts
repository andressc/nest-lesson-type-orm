import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
	constructor(postId: string) {
		super({
			message: `post id = ${postId} not found`,
			field: 'postId',
		});
	}
}
