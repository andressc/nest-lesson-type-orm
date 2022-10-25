import { IsEnum } from 'class-validator';
import { LikeStatusEnum } from './like-status.enum';

export class CreateLikeDto {
	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum;
}
