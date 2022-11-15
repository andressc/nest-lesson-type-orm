import { LikesInfo } from '../../../../common/dto';

export class ResponseCommentDto {
	id: string;
	content: string;
	userId: string;
	userLogin: string;
	createdAt: string;
	likesInfo: LikesInfo;
}
