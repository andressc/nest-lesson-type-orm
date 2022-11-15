import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { LikeStatusEnum } from '../../../../common/dto';
import { ObjectId } from 'mongodb';

export class CreateLikeDto {
	@IsMongoId()
	@IsString()
	itemId: ObjectId;

	@IsMongoId()
	@IsString()
	userId: ObjectId;

	@IsNotEmpty()
	@IsString()
	login: string;

	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum;
}
