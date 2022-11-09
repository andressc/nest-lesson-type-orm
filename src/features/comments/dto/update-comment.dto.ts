import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
	@IsNotEmpty()
	@MinLength(20)
	@MaxLength(300)
	content: string;
}
