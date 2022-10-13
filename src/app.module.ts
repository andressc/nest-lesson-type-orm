import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb+srv://admin:andr5428835@cluster0.ry8zvtg.mongodb.net/learning'),
		FeaturesModule,
		AuthModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
