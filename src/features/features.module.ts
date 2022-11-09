import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { TestingModule } from './testing/testing.module';

@Module({
	imports: [CommentsModule, AuthModule, TestingModule],
	controllers: [],
	providers: [],
})
export class FeaturesModule {}
