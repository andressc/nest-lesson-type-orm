import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { getConnectionToken } from '@nestjs/mongoose';
import { globalValidationPipe } from './common/pipes';

let app: INestApplication;

export const mainTest = async () => {
	const module: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const connection = await module.get(getConnectionToken());

	app = module.createNestApplication();
	app.useGlobalPipes(globalValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.enableCors();
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.use(cookieParser());

	await app.init();
	return { app, module, connection };
};
