import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './Modules/database/database.module';
import { FeaturesModule } from './features/features.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		FeaturesModule,
		DatabaseModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
