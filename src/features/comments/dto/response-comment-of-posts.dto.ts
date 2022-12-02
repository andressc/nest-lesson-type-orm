import { LikesInfo } from '../../../common/dto';

export class ResponseCommentOfPostsDto {
	id: string;
	content: string;
	createdAt: string;
	likesInfo: LikesInfo;
	commentatorInfo: {
		userId: string;
		userLogin: string;
	};
	postInfo: {
		id: string;
		title: string;
		blogId: string;
		blogName: string;
	};
}
