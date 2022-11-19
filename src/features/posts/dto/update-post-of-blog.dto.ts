import { IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { trim } from '../../../common/helpers';

export class UpdatePostOfBlogDto {
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
