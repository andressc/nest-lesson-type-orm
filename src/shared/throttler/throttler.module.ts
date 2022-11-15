import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../../features/public/auth/auth.module';
import { AuthConfig } from '../../configuration';
import { ThrottlerStorageService } from './application/throttler.storage.service';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			imports: [AuthModule],
			useFactory: async (authConfig: AuthConfig) => {
				return { ...authConfig.getThrottlerSettings(), storage: new ThrottlerStorageService() };
			},
			inject: [AuthConfig],
		}),
	],
})
export class ThrottlerLimitModule {}
