import { Module } from '@nestjs/common';
import { MailerService } from './application/mailer.service';
import { MailerAdapter } from './infrastructure/adapters/mailer.adapter';
import { MailerConfig } from '../configuration/mailer.config';

@Module({
	providers: [MailerService, MailerAdapter, MailerConfig],
	exports: [MailerService, MailerAdapter, MailerConfig],
})
export class MailerModule {}
