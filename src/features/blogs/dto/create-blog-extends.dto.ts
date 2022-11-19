import { CreateBlogDto } from './create-blog.dto';

export class CreateBlogExtendsDto extends CreateBlogDto {
	userId: string;
	userLogin: string;
	createdAt: string;
}
