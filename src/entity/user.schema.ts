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
	salt: string;

	@Prop({ required: true })
	confirmationCode: string;

	@Prop({ required: true })
	expirationDate: Date;

	@Prop({ required: true })
	isConfirmed: boolean;

	@Prop({ required: true })
	createdAt: string;

	updateIsConfirmed(isConfirmed: boolean): this {
		this.isConfirmed = isConfirmed;
		return this;
	}
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.updateIsConfirmed = User.prototype.updateIsConfirmed;
