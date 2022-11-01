import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/common/filters/exeption.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../src/common/utils/mongo/mongooseTestModule';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { useContainer } from 'class-validator';

let app: INestApplication;

export const runTestApp = async () => {
	const module: TestingModule = await Test.createTestingModule({
		imports: [rootMongooseTestModule(), AppModule],
	}).compile();

	const connection = await module.get(getConnectionToken());

	app = module.createNestApplication();

	app.useGlobalPipes(
		new ValidationPipe({
			stopAtFirstError: true,
			transform: true,
			exceptionFactory: (errors) => {
				const errorsForResponse = [];

				errors.forEach((e) => {
					const constrainsKeys = Object.keys(e.constraints);

					constrainsKeys.forEach((ckey) => {
						errorsForResponse.push({ message: e.constraints[ckey], field: e.property });
					});
				});

				throw new BadRequestException(errorsForResponse);
			},
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	await app.init();

	return { app, module, connection };
};
