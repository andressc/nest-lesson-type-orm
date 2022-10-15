import { IsNotEmpty, MaxLength } from 'class-validator';
import { trim } from '../../../common/helpers/transform.helper';
import { Transform } from 'class-transformer';

export class CreatePostBlogDto {
	@IsNotEmpty()
	@Transform(({ value }) => trim(value))
	@MaxLength(30)
	title: string;

	@IsNotEmpty()
	@Transform(({ value }) => trim(value))
	@MaxLength(100)
	shortDescription: string;

	@IsNotEmpty()
	@Transform(({ value }) => trim(value))
	@MaxLength(1000)
	content: string;
}