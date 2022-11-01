import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from './app.module';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb+srv://admin:andr5428835@cluster0.ry8zvtg.mongodb.net/learning'),
		AppModule,
	],
	controllers: [],
	providers: [],
})
export class InitModule {}
