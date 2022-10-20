import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserModel = User & Document;

@Schema()
export class User {
	@Prop({ required: true })
	login: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
