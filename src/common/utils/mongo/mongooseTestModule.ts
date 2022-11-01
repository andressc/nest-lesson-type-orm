import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
	MongooseModule.forRootAsync({
		useFactory: async () => {
			mongoServer = await MongoMemoryServer.create();
			const mongoUri = mongoServer.getUri();

			return {
				uri: mongoUri,
				...options,
			};
		},
	});

export const closeInMongodConnection = async () => {
	if (mongoServer) await mongoServer.stop();
};
