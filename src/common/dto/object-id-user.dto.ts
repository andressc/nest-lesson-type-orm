import { IsMongoId, IsString } from 'class-validator';

export class ObjectIdUserDto {
	@IsMongoId()
	@IsString()
	blogId: string;
	userId: string;
}
