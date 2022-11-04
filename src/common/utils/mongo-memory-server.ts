import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const startMongoMemoryServer = async () => {
	mongoServer = await MongoMemoryServer.create();
	return mongoServer.getUri();
};

export const stopMongoMemoryServer = async () => {
	if (mongoServer) await mongoServer.stop();
};
