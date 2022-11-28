import { BanUnbanBlogOfUserDto } from './ban-unban-blog-of-user.dto';

export class BanUnbanBlogOfUserExtendsDto extends BanUnbanBlogOfUserDto {
	blogName: string;
	userId: string;
	login: string;
	banDate: string;
}
