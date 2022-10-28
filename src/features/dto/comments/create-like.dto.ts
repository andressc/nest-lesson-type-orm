import { IsEnum } from 'class-validator';
import { LikeStatusEnum } from '../../../common/dto/like-status.enum';

export class CreateLikeDto {
	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum;
}
