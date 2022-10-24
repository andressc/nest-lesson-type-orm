import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateHash } from '../common/helpers/generateHash.helper';

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

	updateConfirmationCode(confirmationCode: string): this {
		this.confirmationCode = confirmationCode;
		return this;
	}

	async updatePassword(password: string): Promise<this> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await generateHash(password, passwordSalt);

		this.password = passwordHash;
		this.salt = passwordSalt;
		return this;
	}
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.updateIsConfirmed = User.prototype.updateIsConfirmed;
UserSchema.methods.updateConfirmationCode = User.prototype.updateConfirmationCode;
UserSchema.methods.updatePassword = User.prototype.updatePassword;
