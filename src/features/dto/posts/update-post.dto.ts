import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ValidateBlogIdDecorator } from '../../../common/decorators/Validation/validate-blog-id.decorator';
import { Transform } from 'class-transformer';
import { trim } from '../../../common/helpers/transform.helper';

export class UpdatePostDto {
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

	@IsMongoId()
	@IsString()
	@ValidateBlogIdDecorator()
	blogId: string;
}
