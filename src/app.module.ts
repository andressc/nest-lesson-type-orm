import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [FeaturesModule, AuthModule, UsersModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
