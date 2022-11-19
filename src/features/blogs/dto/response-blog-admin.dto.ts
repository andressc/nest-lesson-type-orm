export class ResponseBlogAdminDto {
	id: string;
	name: string;
	description: string;
	websiteUrl: string;
	createdAt: string;
	blogOwnerInfo: {
		userId: string;
		userLogin: string;
	};
}
