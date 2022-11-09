import { CreatePostExtendsDto } from '../dto';
import { PostModel } from '../entity/post.schema';

export abstract class PostsRepositoryInterface {
	abstract createPostModel(data: CreatePostExtendsDto): Promise<PostModel>;
	abstract findPostModel(id: string): Promise<PostModel | null>;
	abstract save(postModel: PostModel): Promise<PostModel>;
	abstract delete(postModel: PostModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
