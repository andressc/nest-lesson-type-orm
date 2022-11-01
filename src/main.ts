import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exeption.filter';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { InitModule } from './init.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(InitModule, { cors: true });
	app.set('trust proxy', 1);
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
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.useGlobalFilters(new HttpExceptionFilter());
	app.enableCors();
	app.use(cookieParser());

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
