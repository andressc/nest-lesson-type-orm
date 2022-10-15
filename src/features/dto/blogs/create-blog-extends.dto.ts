import { CreateBlogDto } from './create-blog.dto';

export class CreateBlogExtendsDto extends CreateBlogDto {
	createdAt: string;
}
