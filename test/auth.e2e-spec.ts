import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { closeInMongodConnection } from '../src/common/utils/mongo/mongooseTestModule';
import { mainT } from '../src/mainT';

describe('BlogController (e2e)', () => {
	let dataApp: { app: INestApplication; module: TestingModule; connection: any };
	let connection: any;
	let app: INestApplication;

	const userDataLogin = {
		login: 'login',
		email: 'email@email.ru',
		password: '123456',
	};

	const userDataMe = {
		login: userDataLogin.login,
		email: userDataLogin.email,
		userId: expect.any(String),
	};

	const registrationErrorsMessages = {
		errorsMessages: [
			{
				field: 'login',
				message: expect.any(String),
			},
			{
				field: 'password',
				message: expect.any(String),
			},
			{
				field: 'email',
				message: expect.any(String),
			},
		],
	};

	const basicAuth = 'Basic YWRtaW46cXdlcnR5';

	beforeAll(async () => {
		dataApp = await mainT();

		connection = dataApp.connection;
		app = dataApp.app.getHttpServer();
	});

	afterAll(async () => {
		await closeInMongodConnection();
		await dataApp.app.close();
	});

	describe('login', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('create new user', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('login user', async () => {
			const accessToken = await request(app)
				.post('/auth/login')
				.set('user-agent', 'test')
				.send({
					login: userDataLogin.login,
					password: userDataLogin.password,
				})
				.expect(200);

			expect(accessToken.body).toEqual({
				accessToken: expect.any(String),
			});

			expect(accessToken.get('Set-Cookie')).toBeDefined();
		});

		/*it('wrong body data', async () => {
			const login = await request(app).post('/auth/login').set('user-agent', 'test').expect(400);

			expect(login.body).toEqual(loginErrorsMessages);
		});*/

		/*it('login too many requests', async () => {
			for (let i = 0; i < 5; i++) {
				await request(app).post('/auth/login').expect(400);
			}
			await request(app).post('/auth/login').expect(429);
		});*/
	});

	describe('registration', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		it('registration new user', async () => {
			await request(app).post('/auth/registration').send(userDataLogin).expect(204);
		});

		it('registration user login user already exists', async () => {
			const userError = await request(app)
				.post('/auth/registration')
				.send({ ...userDataLogin, email: 'newemail@email.ru' })
				.expect(400);

			expect(userError.body).toEqual({
				errorsMessages: [
					{
						field: 'login',
						message: expect.any(String),
					},
				],
			});
		});

		it('registration user email user already exists', async () => {
			const userError = await request(app)
				.post('/auth/registration')
				.send({ ...userDataLogin, login: 'newlogin@email.ru' })
				.expect(400);

			expect(userError.body).toEqual({
				errorsMessages: [
					{
						field: 'login',
						message: expect.any(String),
					},
				],
			});
		});

		it('registration with incorrect body data', async () => {
			const user = await request(app).post('/auth/registration').expect(400);

			expect(user.body).toEqual(registrationErrorsMessages);
		});

		/*
		it('registration too many requests step 1', async () => {
			await request(app).post('/auth/registration').expect(400);
		});

		it('registration too many requests step 2', async () => {
			await request(app).post('/auth/registration').expect(429);
		});
		 */
	});

	describe('refresh-token', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('create new user', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('login user', async () => {
			const accessToken = await request(app)
				.post('/auth/login')
				.set('user-agent', 'test')
				.send({
					login: userDataLogin.login,
					password: userDataLogin.password,
				})
				.expect(200);

			expect(accessToken.body).toEqual({
				accessToken: expect.any(String),
			});

			expect(accessToken.get('Set-Cookie')).toBeDefined();

			newRefreshToken = accessToken.get('Set-Cookie')[0];
		});

		it('refresh token', async () => {
			const newTokens = await request(app)
				.post('/auth/refresh-token')
				.set('Cookie', [newRefreshToken])
				.set('user-agent', 'test')
				.send({
					login: userDataLogin.login,
					password: userDataLogin.password,
				})
				.expect(200);

			expect(newTokens.body).toEqual({
				accessToken: expect.any(String),
			});

			expect(newTokens.get('Set-Cookie')).toBeDefined();
		});
	});

	describe('get me', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let token;

		it('create new user', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('login user', async () => {
			const accessToken = await request(app)
				.post('/auth/login')
				.set('user-agent', 'test')
				.send({
					login: userDataLogin.login,
					password: userDataLogin.password,
				})
				.expect(200);

			expect(accessToken.body).toEqual({
				accessToken: expect.any(String),
			});

			token = accessToken.body.accessToken;
		});

		it('get me', async () => {
			const user = await request(app)
				.get('/auth/me')
				.set('user-agent', 'test')
				.set('authorization', `Bearer ${token}`)
				.expect(200);

			expect(user.body).toEqual(userDataMe);
		});
	});

	/*describe('registration confirmation', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('registration confirmation', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('registration confirmation too many requests', async () => {
			for (let i = 0; i < 2; i++) {
				await request(app).post('/auth/registration').expect(400);
			}
			await request(app).post('/auth/registration').expect(429);
		});
	});*/

	/*describe('registration email resending', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('registration email resending', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('registration email resending too many requests', async () => {
			for (let i = 0; i < 2; i++) {
				await request(app).post('/auth/registration').expect(400);
			}
			await request(app).post('/auth/registration').expect(429);
		});
	});*/

	/*describe('logout', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('registration-email-resending', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});
	});*/

	/*describe('new password', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('new password', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('new password too many requests', async () => {
			for (let i = 0; i < 2; i++) {
				await request(app).post('/auth/registration').expect(400);
			}
			await request(app).post('/auth/registration').expect(429);
		});
	});*/

	/*describe('password recovery', () => {
		beforeAll(async () => {
			await connection.dropDatabase();
		});

		let newRefreshToken;

		it('password recovery', async () => {
			await request(app)
				.post('/users')
				.set('authorization', basicAuth)
				.send(userDataLogin)
				.expect(201);
		});

		it('password recovery too many requests', async () => {
			for (let i = 0; i < 2; i++) {
				await request(app).post('/auth/registration').expect(400);
			}
			await request(app).post('/auth/registration').expect(429);
		});
	});*/
});
