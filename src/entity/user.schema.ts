import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateHash } from '../common/helpers';

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

	updateIsConfirmed(isConfirmed: boolean): void {
		this.isConfirmed = isConfirmed;
	}

	updateConfirmationCode(confirmationCode: string): void {
		this.confirmationCode = confirmationCode;
	}

	async updatePassword(password: string): Promise<void> {
		const passwordSalt = await bcrypt.genSalt(10);
		this.password = await generateHash(password, passwordSalt);
		this.salt = passwordSalt;
	}
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.updateIsConfirmed = User.prototype.updateIsConfirmed;
UserSchema.methods.updateConfirmationCode = User.prototype.updateConfirmationCode;
UserSchema.methods.updatePassword = User.prototype.updatePassword;
