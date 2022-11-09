import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { globalValidationPipe } from './common/pipes';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
	app.set('trust proxy', 1);
	app.useGlobalPipes(globalValidationPipe());
	useContainer(app.select(AppModule), {
		fallbackOnErrors: true,
	});
	app.useGlobalFilters(new HttpExceptionFilter());
	app.enableCors();
	app.use(cookieParser());

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
