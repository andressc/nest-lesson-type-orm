import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
	constructor(commentId: string) {
		super({
			message: `comment id = ${commentId} not found`,
			field: 'commentId',
		});
	}
}
