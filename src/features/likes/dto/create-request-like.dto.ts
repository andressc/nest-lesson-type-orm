import { IsEnum } from 'class-validator';
import { LikeStatusEnum } from '../../../common/dto';

export class CreateRequestLikeDto {
	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum;
}
