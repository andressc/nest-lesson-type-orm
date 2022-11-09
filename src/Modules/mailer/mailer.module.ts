import { Module } from '@nestjs/common';
import { MailerAdapter } from './infrastructure/adapters/mailer.adapter';
import { MailerConfig } from '../../configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { SendEmailRegistrationMessageMailerHandler } from './application/commands/send-email-registration-message-mailer.handler';
import { SendEmailPasswordRecoveryMailerHandler } from './application/commands/send-email-password-recovery-mailer.handler';

export const CommandHandlers = [
	SendEmailRegistrationMessageMailerHandler,
	SendEmailPasswordRecoveryMailerHandler,
];

@Module({
	imports: [CqrsModule],
	providers: [MailerAdapter, MailerConfig, ...CommandHandlers],
})
export class MailerModule {}
