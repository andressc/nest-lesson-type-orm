import { IsEnum } from 'class-validator';
import { LikeStatusEnum } from '../../../common/dto';

export class CreateLikeDto {
	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum;
}
