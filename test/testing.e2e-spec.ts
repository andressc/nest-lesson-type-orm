import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { mainTest } from '../src/main-test';
import request from 'supertest';
import { blogCreator } from './dbSeeding/blogCreator';
import { commentCreator } from './dbSeeding/commentCreator';
import { postCreator } from './dbSeeding/postCreator';
import { userCreator } from './dbSeeding/userCreator';
import { sessionCreator } from './dbSeeding/sessionCreator';
import { stopMongoMemoryServer } from '../src/common/utils';
import { Blog } from '../src/features/public/blogs/entity/blog.schema';
import { Post } from '../src/features/public/posts/entity/post.schema';
import { Session } from 'inspector';
import { User } from '../src/features/admin/users/entity/user.schema';
import { Comment } from '../src/features/public/comments/entity/comment.schema';

describe('PostController (e2e)', () => {
	let dataApp: { app: INestApplication; module: TestingModule; connection: Connection };
	let BlogModel: Model<Blog>;
	let PostModel: Model<Post>;
	let CommentModel: Model<Comment>;
	let SessionModel: Model<Session>;
	let UserModel: Model<User>;

	let connection: Connection;
	let app: INestApplication;
	let module: TestingModule;

	const postData = {
		shortDescription: 'shortDescription',
		content: 'content',
		blogId: 'blogId',
		blogName: 'blogName',
	};

	beforeAll(async () => {
		dataApp = await mainTest();

		connection = dataApp.connection;
		app = dataApp.app.getHttpServer();
		module = dataApp.module;

		BlogModel = module.get<Model<Blog>>(getModelToken(Blog.name));
		PostModel = module.get<Model<Post>>(getModelToken(Post.name));
		CommentModel = module.get<Model<Comment>>(getModelToken(Comment.name));
		SessionModel = module.get<Model<Session>>(getModelToken(Session.name));
		UserModel = module.get<Model<User>>(getModelToken(User.name));
	});

	afterAll(async () => {
		await stopMongoMemoryServer();
		await dataApp.app.close();
	});

	describe('delete all data', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
			await PostModel.create(postCreator('title', postData, 1));
			await BlogModel.create(blogCreator('name', 1, 'youtubeUrl'));
			await UserModel.create(userCreator('login', 'email', 1));
			await CommentModel.create(commentCreator('content', 'userId', 'userLogin', 'postId', 1));
			await SessionModel.create(sessionCreator());
		});

		it('delete all', async () => {
			await request(app).delete('/testing/all-data').expect(204);
		});

		it('find after deleting', async () => {
			const postCount = await PostModel.countDocuments({});
			const blogCount = await BlogModel.countDocuments({});
			const userCount = await UserModel.countDocuments({});
			const commentCount = await CommentModel.countDocuments({});
			const sessionIpCount = await SessionModel.countDocuments({});

			expect(postCount).toBe(0);
			expect(blogCount).toBe(0);
			expect(userCount).toBe(0);
			expect(commentCount).toBe(0);
			expect(sessionIpCount).toBe(0);
		});
	});
});
