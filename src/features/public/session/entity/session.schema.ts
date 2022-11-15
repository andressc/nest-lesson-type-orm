import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionModel = Session & Document;

@Schema()
export class Session {
	@Prop({ required: true })
	ip: string;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	lastActiveDate: string;

	@Prop({ required: true })
	expirationDate: string;

	@Prop({ required: true })
	deviceId: string;

	@Prop({ required: true })
	userId: string;

	updateSession(
		lastActiveDate: string,
		expirationDate: string,
		ip: string,
		userAgent: string,
	): void {
		this.lastActiveDate = lastActiveDate;
		this.expirationDate = expirationDate;
		this.ip = ip;
		this.title = userAgent;
	}
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.methods.updateSession = Session.prototype.updateSession;
