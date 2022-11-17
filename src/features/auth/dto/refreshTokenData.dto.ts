import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDataDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	deviceId: string;

	@IsNotEmpty()
	@IsString()
	lastActiveDate: string;

	@IsNotEmpty()
	@IsString()
	userAgent: string;

	@IsNotEmpty()
	@IsString()
	ip: string;
}
