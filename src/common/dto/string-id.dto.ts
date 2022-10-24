import { IsString } from 'class-validator';

export class StringIdDto {
	@IsString()
	id: string;
}
