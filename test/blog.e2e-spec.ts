import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection, Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Blog } from '../src/database/entity';
import { mainTest } from '../src/main-test';
import { ObjectId } from 'mongodb';
import { blogCreator } from './dbSeeding/blogCreator';
import { stopMongoMemoryServer } from '../src/common/utils';
import { BASIC_AUTH } from './constants';

describe('BlogController (e2e)', () => {
	let dataApp: { app: INestApplication; module: TestingModule; connection: Connection };
	let BlogModel: Model<Blog>;
	let connection: Connection;
	let app: INestApplication;
	let module: TestingModule;

	const randomId = new ObjectId().toString();

	const blogData = {
		id: expect.any(String),
		youtubeUrl: 'https://youtube.com/343344343fvcxv32rfdsvd',
		name: 'name',
		createdAt: expect.any(String),
	};

	const blogErrorsMessages = {
		errorsMessages: [
			{
				field: 'name',
				message: expect.any(String),
			},
			{
				field: 'youtubeUrl',
				message: expect.any(String),
			},
		],
	};

	beforeAll(async () => {
		dataApp = await mainTest();

		connection = dataApp.connection;
		app = dataApp.app.getHttpServer();
		module = dataApp.module;

		BlogModel = module.get<Model<Blog>>(getModelToken(Blog.name));
	});

	afterAll(async () => {
		await stopMongoMemoryServer();
		await dataApp.app.close();
	});

	describe('add, get, delete new blog', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let blogId;

		it('should return 404 for not existing blog', async () => {
			await request(app).get(`/blogs/${randomId}`).expect(404);
		});

		it('should return 200 and all blogs null', async () => {
			const response = await request(app).get('/blogs').expect(200);

			expect(response.body).toEqual({
				pagesCount: 0,
				page: 1,
				pageSize: 10,
				totalCount: 0,
				items: [],
			});
		});

		it('add new blog', async () => {
			const blog = await request(app)
				.post('/blogs')
				.set('authorization', BASIC_AUTH)
				.send({
					name: blogData.name,
					youtubeUrl: blogData.youtubeUrl,
				})
				.expect(201);

			expect(blog.body).toEqual(blogData);

			blogId = blog.body.id;
		});

		it('get all blogs after add', async () => {
			const allBlogs = await request(app).get('/blogs').expect(200);

			expect(allBlogs.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 1,
				items: [blogData],
			});
		});

		it('find existing blog by id after add', async () => {
			const blog = await request(app).get(`/blogs/${blogId}`).expect(200);
			expect(blog.body).toEqual(blogData);
		});

		it('delete blog by id', async () => {
			await request(app).delete(`/blogs/${blogId}`).set('authorization', BASIC_AUTH).expect(204);
		});

		it('find not existing blog by id after delete', async () => {
			await request(app).get(`/blogs/${blogId}`).expect(404);
		});

		it('delete a blog that does not exist', async () => {
			await request(app).delete(`/blogs/${randomId}`).set('authorization', BASIC_AUTH).expect(404);
		});
	});

	describe('update blog', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let blogId;

		it('add new blog', async () => {
			const blog = await request(app)
				.post('/blogs')
				.set('authorization', BASIC_AUTH)
				.send({
					name: blogData.name,
					youtubeUrl: blogData.youtubeUrl,
				})
				.expect(201);

			blogId = blog.body.id;
		});

		it('update blog after add', async () => {
			await request(app)
				.put(`/blogs/${blogId}`)
				.set('authorization', BASIC_AUTH)
				.send({
					name: 'newName',
					youtubeUrl: 'https://www.youtube.com/channel/aaaaaaaaaaaaaaaaaaaa',
				})
				.expect(204);
		});

		it('get blog after update', async () => {
			const blog = await request(app).get(`/blogs/${blogId}`).expect(200);

			expect(blog.body).toEqual({
				...blogData,
				name: 'newName',
				youtubeUrl: 'https://www.youtube.com/channel/aaaaaaaaaaaaaaaaaaaa',
			});
		});

		it('update a blog that does not exist', async () => {
			await request(app)
				.put(`/blogs/${randomId}`)
				.set('authorization', BASIC_AUTH)
				.send({
					name: blogData.name,
					youtubeUrl: blogData.youtubeUrl,
				})
				.expect(404);
		});
	});

	describe('add, update new blog with incorrect body data', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('add a new blog with incorrect body data', async () => {
			const blogError = await request(app)
				.post('/blogs')
				.set('authorization', BASIC_AUTH)
				.send({
					youtubeUrl: 'invalid-url',
				})
				.expect(400);

			expect(blogError.body).toEqual(blogErrorsMessages);
		});

		it('update blog with incorrect body data', async () => {
			const blogError = await request(app)
				.put(`/blogs/${randomId}`)
				.set('authorization', BASIC_AUTH)
				.send({
					youtubeUrl: 'invalid-url',
				})
				.expect(400);

			expect(blogError.body).toEqual(blogErrorsMessages);
		});
	});

	describe('add, delete, update blog with not authorized user', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('add blog with not authorized user', async () => {
			await request(app)
				.post('/blogs')
				.set('authorization', 'wrongAuth')
				.send(blogData)
				.expect(401);
		});

		it('delete blog with not authorized user', async () => {
			await request(app).delete(`/blogs/${randomId}`).set('authorization', 'wrongAuth').expect(401);
		});

		it('update blog with not authorized user', async () => {
			await request(app)
				.put(`/blogs/${randomId}`)
				.set('authorization', 'wrongAuth')
				.send(blogData)
				.expect(401);
		});
	});

	describe('get all blogs and sorting', () => {
		beforeAll(async () => {
			await connection.dropDatabase();

			await BlogModel.insertMany([
				blogCreator('aName', 1, blogData.youtubeUrl),
				blogCreator('cName', 2, blogData.youtubeUrl),
				blogCreator('bName', 3, blogData.youtubeUrl),
			]);
		});

		it('should return 200 and all blogs', async () => {
			const response = await request(app).get('/blogs').expect(200);

			expect(response.body).toEqual({
				pagesCount: 1,
				page: 1,
				pageSize: 10,
				totalCount: 3,
				items: [
					{ ...blogData, name: 'bName' },
					{ ...blogData, name: 'cName' },
					{ ...blogData, name: 'aName' },
				],
			});
		});

		it('sorting and pages blogs', async () => {
			const response = await request(app)
				.get('/blogs?sortBy=name&pageSize=2&sortDirection=asc')
				.expect(200);

			expect(response.body).toEqual({
				pagesCount: 2,
				page: 1,
				pageSize: 2,
				totalCount: 3,
				items: [
					{ ...blogData, name: 'aName' },
					{ ...blogData, name: 'bName' },
				],
			});
		});
	});
});
