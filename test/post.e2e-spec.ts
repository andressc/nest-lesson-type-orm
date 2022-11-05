import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Blog } from '../src/database/entity/blog.schema';
import { mainTest } from '../src/main-test';
import { ObjectId } from 'mongodb';
import { Post } from '../src/database/entity/post.schema';
import { blogCreator } from './dbSeeding/blogCreator';
import { postCreator } from './dbSeeding/postCreator';
import { stopMongoMemoryServer } from '../src/common/utils/mongo-memory-server';

describe('PostController (e2e)', () => {
	let dataApp: { app: INestApplication; module: TestingModule; connection: Connection };
	let BlogModel: Model<Blog>;
	let PostModel: Model<Post>;
	let connection: Connection;
	let app: INestApplication;
	let module: TestingModule;

	const randomId = new ObjectId().toString();

	const blogData = {
		id: new ObjectId().toString(),
		youtubeUrl: 'https://youtube.com/343344343fvcxv32rfdsvd',
		name: 'name',
		createdAt: expect.any(String),
	};

	const postData = {
		id: expect.any(String),
		title: 'title',
		shortDescription: 'shortDescription',
		content: 'content content content content content',
		blogId: blogData.id,
		blogName: blogData.name,
		createdAt: expect.any(String),
		extendedLikesInfo: {
			dislikesCount: 0,
			likesCount: 0,
			myStatus: 'None',
			newestLikes: [],
		},
	};

	const postErrorsMessages = {
		errorsMessages: [
			{
				field: 'title',
				message: expect.any(String),
			},
			{
				field: 'shortDescription',
				message: expect.any(String),
			},
			{
				field: 'content',
				message: expect.any(String),
			},
			{
				field: 'blogId',
				message: expect.any(String),
			},
		],
	};

	const basicAuth = 'Basic YWRtaW46cXdlcnR5';

	beforeAll(async () => {
		dataApp = await mainTest();

		connection = dataApp.connection;
		app = dataApp.app.getHttpServer();
		module = dataApp.module;

		BlogModel = module.get<Model<Blog>>(getModelToken(Blog.name));
		PostModel = module.get<Model<Post>>(getModelToken(Post.name));
	});

	afterAll(async () => {
		await stopMongoMemoryServer();
		await dataApp.app.close();
	});

	describe('add, get, delete new post', () => {
		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.create(blogCreator(blogData.name, 1, blogData.youtubeUrl, blogData.id));
		});

		let postId;

		it('should return 404 for not existing post', async () => {
			await request(app).get(`/posts/${randomId}`).expect(404);
		});

		it('should return 200 and all posts null', async () => {
			const response = await request(app).get('/posts').expect(200);

			expect(response.body).toEqual({
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
		});

		it('add new post', async () => {
			const createdPost = await request(app)
				.post('/posts')
				.set('authorization', basicAuth)
				.send({
					title: postData.title,
					shortDescription: postData.shortDescription,
					content: postData.content,
					blogId: blogData.id,
				})
				.expect(201);

			expect(createdPost.body).toEqual(postData);

			postId = createdPost.body.id;
		});

		it('get all posts after add', async () => {
			const allPosts = await request(app).get(`/posts`).expect(200);

			expect(allPosts.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 1,
				items: [postData],
			});
		});

		it('find existing post by id after add', async () => {
			const blog = await request(app).get(`/posts/${postId}`).expect(200);
			expect(blog.body).toEqual(postData);
		});

		it('delete post by id', async () => {
			await request(app).delete(`/posts/${postId}`).set('authorization', basicAuth).expect(204);
		});

		it('find not existing post by id after delete', async () => {
			await request(app).get(`/posts/${postId}`).expect(404);
		});

		it('delete a post that does not exist', async () => {
			await request(app).delete(`/posts/${randomId}`).set('authorization', basicAuth).expect(404);
		});
	});

	describe('update post', () => {
		const blogIdNew = new ObjectId().toString();

		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.insertMany([
				blogCreator(blogData.name, 1, blogData.youtubeUrl, blogData.id),
				blogCreator('newName', 1, blogData.youtubeUrl, blogIdNew),
			]);
		});

		let postId;

		it('add new post', async () => {
			const createdPost = await request(app)
				.post('/posts')
				.set('authorization', basicAuth)
				.send({
					title: postData.title,
					shortDescription: postData.shortDescription,
					content: postData.content,
					blogId: blogData.id,
				})
				.expect(201);

			postId = createdPost.body.id;
		});

		it('update post after add', async () => {
			await request(app)
				.put(`/posts/${postId}`)
				.set('authorization', basicAuth)
				.send({
					title: 'new title',
					shortDescription: 'new Short description',
					content: 'new Content',
					blogId: blogIdNew,
				})
				.expect(204);
		});

		it('get post after update', async () => {
			const getUpdatedPost = await request(app).get(`/posts/${postId}`).expect(200);

			expect(getUpdatedPost.body).toEqual({
				...postData,
				title: 'new title',
				shortDescription: 'new Short description',
				content: 'new Content',
				blogId: blogIdNew,
				blogName: 'newName',
			});
		});

		it('update a post that does not exist', async () => {
			await request(app)
				.put(`/posts/${randomId}`)
				.set('authorization', basicAuth)
				.send({
					title: 'new title',
					shortDescription: 'new Short description',
					content: 'new Content',
					blogId: blogIdNew,
				})
				.expect(404);
		});
	});

	describe('add, update new post with incorrect body data', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('add a new post with incorrect body data', async () => {
			const addPostError = await request(app)
				.post('/posts')
				.set('authorization', basicAuth)
				.expect(400);

			expect(addPostError.body).toEqual(postErrorsMessages);
		});

		it('update post with incorrect body data', async () => {
			const updatePostError = await request(app)
				.put(`/posts/${randomId}`)
				.set('authorization', basicAuth)
				.expect(400);

			expect(updatePostError.body).toEqual({
				errorsMessages: [
					...postErrorsMessages.errorsMessages,
					{
						field: 'blogId',
						message: expect.any(String),
					},
				],
			});
		});
	});

	describe('add, delete, update blog with not authorized user', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('add post with not authorized user', async () => {
			await request(app)
				.post('/posts')
				.set('authorization', 'wrongAuth')
				.send(postData)
				.expect(401);
		});

		it('delete post with not authorized user', async () => {
			await request(app).delete(`/posts/${randomId}`).set('authorization', 'wrongAuth').expect(401);
		});

		it('update post with not authorized user', async () => {
			await request(app)
				.put(`/posts/${randomId}`)
				.set('authorization', 'wrongAuth')
				.send(postData)
				.expect(401);
		});
	});

	describe('create new post for specific blog', () => {
		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.create(blogCreator(blogData.name, 1, blogData.youtubeUrl, blogData.id));
		});

		it('create new post for specific blog with not authorized user', async () => {
			await request(app)
				.post(`/blogs/${blogData.id}/posts`)
				.set('authorization', 'wrongAuth')
				.send(postData)
				.expect(401);
		});

		it('create new post for specific blog', async () => {
			const createdPost = await request(app)
				.post(`/blogs/${blogData.id}/posts`)
				.set('authorization', basicAuth)
				.send({
					title: postData.title,
					shortDescription: postData.shortDescription,
					content: postData.content,
				})
				.expect(201);

			expect(createdPost.body).toEqual(postData);
		});
	});

	/*describe('test Likes', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('test Likes', async () => {
			const createdPost = await request(app)
				.post(`/blogs/${blogData.id}/posts`)
				.set('authorization', basicAuth)
				.send({
					title: postData.title,
					shortDescription: postData.shortDescription,
					content: postData.content,
				})
				.expect(201);

			expect(createdPost.body).toEqual(postData);
		});
	});*/

	describe('get all posts and sorting', () => {
		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.create(blogCreator(blogData.name, 1, blogData.youtubeUrl, blogData.id));

			await PostModel.insertMany([
				postCreator('aTitle', postData, 1),
				postCreator('cTitle', postData, 2),
				postCreator('bTitle', postData, 3),
			]);
		});

		it('should return 200 and all posts', async () => {
			const response = await request(app).get('/posts').expect(200);

			expect(response.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 3,
				items: [
					{ ...postData, title: 'bTitle' },
					{ ...postData, title: 'cTitle' },
					{ ...postData, title: 'aTitle' },
				],
			});
		});

		it('sorting and pages posts', async () => {
			const response = await request(app)
				.get('/posts?sortBy=title&pageSize=2&sortDirection=asc')
				.expect(200);

			expect(response.body).toEqual({
				pagesCount: 2,
				page: 1,
				pageSize: 2,
				totalCount: 3,
				items: [
					{ ...postData, title: 'aTitle' },
					{ ...postData, title: 'bTitle' },
				],
			});
		});
	});

	describe('should return all posts for blog and sorting', () => {
		const blogIdNew = new ObjectId().toString();

		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.insertMany([
				blogCreator(blogData.name, 1, blogData.youtubeUrl, blogData.id),
				blogCreator('newName', 1, blogData.youtubeUrl, blogIdNew),
			]);

			await PostModel.insertMany([
				postCreator('aTitle', { ...postData, blogId: blogData.id, blogName: blogData.name }, 1),
				postCreator('cTitle', { ...postData, blogId: blogData.id, blogName: blogData.name }, 2),
				postCreator('bTitle', { ...postData, blogId: blogData.id, blogName: blogData.name }, 3),
				postCreator('dTitle', { ...postData, blogId: blogIdNew, blogName: 'newName' }, 4),
			]);
		});

		it('should return all posts for blog', async () => {
			const response = await request(app).get(`/blogs/${blogData.id}/posts`).expect(200);

			expect(response.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 3,
				items: [
					{ ...postData, title: 'bTitle' },
					{ ...postData, title: 'cTitle' },
					{ ...postData, title: 'aTitle' },
				],
			});
		});

		it('sorting and pages posts for blog', async () => {
			const response = await request(app)
				.get(`/blogs/${blogData.id}/posts?sortBy=title&pageSize=2&sortDirection=asc`)
				.expect(200);

			expect(response.body).toEqual({
				pagesCount: 2,
				page: 1,
				pageSize: 2,
				totalCount: 3,
				items: [
					{ ...postData, title: 'aTitle' },
					{ ...postData, title: 'bTitle' },
				],
			});
		});
	});
});
