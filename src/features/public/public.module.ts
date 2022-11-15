import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { TestingModule } from './testing/testing.module';

@Module({
	imports: [CommentsModule, TestingModule],
	controllers: [],
	providers: [],
})
export class PublicModule {}
