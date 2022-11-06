import { CreatePostExtendsDto } from '../../../dto/posts';
import { PostModel } from '../../../../database/entity';

export abstract class PostsRepositoryInterface {
	abstract createPostModel(data: CreatePostExtendsDto): Promise<PostModel>;
	abstract findPostModel(id: string): Promise<PostModel | null>;
	abstract save(postModel: PostModel): Promise<PostModel>;
	abstract delete(postModel: PostModel): Promise<void>;
	abstract deleteAll(): Promise<void>;
}
