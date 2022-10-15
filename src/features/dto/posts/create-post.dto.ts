import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ValidateBlogIdDecorator } from '../../../common/decorators/Validation/validate-blog-id.decorator';

export class CreatePostDto {
	@IsNotEmpty()
	@MaxLength(30)
	title: string;

	@IsNotEmpty()
	@MaxLength(100)
	shortDescription: string;

	@IsNotEmpty()
	@MaxLength(1000)
	content: string;

	@IsMongoId()
	@IsString()
	@ValidateBlogIdDecorator()
	blogId: string;
}
