import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogModel } from '../../../features/blogs/entity/blog.schema';
import { BlogsRepositoryAdapter } from '../../../features/blogs/adapters/blogs.repository.adapter';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserCommentValidatorConstraint implements ValidatorConstraintInterface {
	constructor(private readonly blogRepository: BlogsRepositoryAdapter) {}

	async validate(blogId: string): Promise<boolean> {
		const blog: BlogModel | null = await this.blogRepository.findBlogModel(blogId);
		if (!blog) return false;

		return true;
	}

	defaultMessage(): string {
		return 'Blog not found';
	}
}

export function ValidateBlogIdDecorator(validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'IsUserComment',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsUserCommentValidatorConstraint,
		});
	};
}
