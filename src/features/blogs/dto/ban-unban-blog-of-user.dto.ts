import { IsBoolean, IsMongoId, IsString, MinLength } from 'class-validator';

export class BanUnbanBlogOfUserDto {
	@IsBoolean()
	isBanned: boolean;

	@MinLength(20)
	banReason: string;

	@IsMongoId()
	@IsString()
	blogId: string;
}
