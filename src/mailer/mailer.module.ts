import { Module } from '@nestjs/common';
import { MailerAdapter } from './infrastructure/adapters/mailer.adapter';
import { MailerConfig } from '../configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { SendEmailRegistrationMessageMailerCommand } from './application/commands/send-email-registration-message-mailer.handler';
import { SendEmailPasswordRecoveryMailerHandler } from './application/commands/send-email-password-recovery-mailer.handler';
import { MailerService } from './application/mailer.service';

export const CommandHandlers = [
	SendEmailRegistrationMessageMailerCommand,
	SendEmailPasswordRecoveryMailerHandler,
];
export const QueryHandlers = [];

@Module({
	imports: [CqrsModule],
	providers: [MailerService, MailerAdapter, MailerConfig],
	exports: [MailerAdapter, MailerConfig, MailerService],
})
export class MailerModule {}
