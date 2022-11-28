import { IsMongoId, IsString } from 'class-validator';

export class ObjectIdsDto {
	@IsMongoId()
	@IsString()
	blogId: string;

	@IsMongoId()
	@IsString()
	postId: string;
}
