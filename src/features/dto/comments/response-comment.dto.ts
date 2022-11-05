import { LikesInfo } from '../../../common/dto/likes-info.dto';

export class ResponseCommentDto {
	id: string;
	content: string;
	userId: string;
	userLogin: string;
	createdAt: string;
	likesInfo: LikesInfo;
}
