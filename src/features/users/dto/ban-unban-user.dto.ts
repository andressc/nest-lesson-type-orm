import { IsBoolean, MinLength } from 'class-validator';

export class BanUnbanUserDto {
	@IsBoolean()
	isBanned: boolean;

	@MinLength(20)
	banReason: string;
}
