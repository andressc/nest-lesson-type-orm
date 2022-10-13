import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpCode,
	Put,
	UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/blogs/create-blog.dto';
import { UpdateBlogDto } from '../dto/blogs/update-blog.dto';
import { BlogsService } from '../application/blogs.service';
import { QueryBlogsRepository } from './query/query-blogs.repository';
import { ObjectIdDto } from '../dto/general/object-id.dto';
import { BasicAuthGuard } from '../../common/guards/basic-auth.guard';

@Controller('blogs')
export class BlogsController {
	constructor(
		private readonly blogsService: BlogsService,
		private readonly queryBlogRepository: QueryBlogsRepository,
	) {}

	@UseGuards(BasicAuthGuard)
	@Post()
	async createBlog(@Body() data: CreateBlogDto) {
		const blogId = await this.blogsService.createBlog(data);
		return this.queryBlogRepository.findOneBlog(blogId);
	}

	@Get()
	findAllBlogs() {
		return this.queryBlogRepository.findAllBlogs();
	}

	@Get(':id')
	findOneBlog(@Param() param: ObjectIdDto) {
		return this.queryBlogRepository.findOneBlog(param.id);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Put(':id')
	async updateBlog(@Param() param: ObjectIdDto, @Body() data: UpdateBlogDto) {
		await this.blogsService.updateBlog(param.id, data);
	}

	@HttpCode(204)
	@UseGuards(BasicAuthGuard)
	@Delete(':id')
	async remove(@Param() param: ObjectIdDto) {
		await this.blogsService.removeBlog(param.id);
	}
}
