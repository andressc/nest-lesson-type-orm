import { NotFoundException } from '@nestjs/common';

export class BlogNotFoundException extends NotFoundException {
	constructor(blogId: string) {
		super({
			message: `blog id = ${blogId} not found`,
			field: 'blogId',
		});
	}
}
