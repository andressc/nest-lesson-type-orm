import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './services/database/database.module';
import { BlogsModule } from './features/blogs/blogs.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		BlogsModule,
		DatabaseModule,
	],
	controllers: [],
	providers: [],
})
export class App2Module {}
