import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateBlogDto {
	@IsNotEmpty()
	@MaxLength(10)
	name: string;

	@IsNotEmpty()
	@Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
	@MaxLength(100)
	youtubeUrl: string;
}
