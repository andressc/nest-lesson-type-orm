import { ConfigModule } from '@nestjs/config';
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

console.log(process.env.NODE_ENV);

@Module({
	imports: [configModule, FeaturesModule, AuthModule, UsersModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
