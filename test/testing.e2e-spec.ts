import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { closeInMongodConnection } from '../src/common/utils/mongo/mongooseTestModule';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Blog } from '../src/entity/blog.schema';
import { runTestApp } from './run-test-app';
import { Post } from '../src/entity/post.schema';

describe('PostController (e2e)', () => {
	let dataApp: { app: INestApplication; module: TestingModule; connection: any };
	let BlogModel: Model<Blog>;
	let PostModel: Model<Post>;
	let connection: any;
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		dataApp = await runTestApp();

		connection = dataApp.connection;
		app = dataApp.app.getHttpServer();
		module = dataApp.module;

		BlogModel = module.get<Model<Blog>>(getModelToken(Blog.name));
		PostModel = module.get<Model<Post>>(getModelToken(Post.name));
	});

	afterAll(async () => {
		await closeInMongodConnection();
		await dataApp.app.close();
	});

	it('void', async () => {
		expect(1).toBe(1);
	});

	/*describe('delete all data', () => {
		beforeAll(async () => {
			await connection.dropDatabase();

			await PostModel.create({
				_id: idCreator(),
				title: 'title',
				shortDescription: 'shortDescription',
				content: 'content',
				blogId: idCreator(),
				blogName: 'blogName',
				createdAt: new Date().toISOString(),
			});

			await BlogModel.create({
				_id: idCreator(),
				name: 'name',
				youtubeUrl: 'youtubeUrl',
				createdAt: new Date().toISOString(),
			});

			await UserModel.create({
				_id: idCreator(),
				emailConfirmation: {
					confirmationCode: 'confirmationCode',
					expirationDate: new Date().toISOString(),
					isConfirmed: true,
				},
				accountData: {
					login: 'login',
					email: 'email@email',
					passwordHash: 'passwordHash',
				},
				createdAt: new Date().toISOString(),
			});

			await CommentModel.create({
				_id: idCreator(),
				content: 'content',
				userId: idCreator(),
				userLogin: 'userLogin',
				postId: idCreator(),
				createdAt: new Date().toISOString(),
			});

			await RemoteUserIpModel.create({
				_id: idCreator(),
				ip: 'ip',
				url: 'url',
				date: new Date().toISOString(),
			});

			await RefreshTokenModel.create({
				refreshToken: 'refreshToken',
			});

			await LikeModel.create({
				_id: idCreator(),
				type: 'type',
				login: 'login',
				userId: idCreator(),
				itemId: idCreator(),
				likeStatus: 'likeStatus',
				addedAt: new Date().toISOString(),
			});
		});

		it('delete all', async () => {
			await request(app).delete('/testing/all-data').expect(HttpStatusCode.NO_CONTENT);
		});

		it('find after deleting', async () => {
			const postCount = await PostModel.countDocuments({});
			const blogCount = await BlogModel.countDocuments({});
			const userCount = await UserModel.countDocuments({});
			const commentCount = await CommentModel.countDocuments({});
			const remoteUserIpCount = await RemoteUserIpModel.countDocuments({});
			const refreshToken = await RefreshTokenModel.countDocuments({});
			const likeCount = await LikeModel.countDocuments({});

			expect(postCount).toBe(0);
			expect(blogCount).toBe(0);
			expect(userCount).toBe(0);
			expect(commentCount).toBe(0);
			expect(remoteUserIpCount).toBe(0);
			expect(refreshToken).toBe(0);
			expect(likeCount).toBe(0);
		});
	});*/
});
