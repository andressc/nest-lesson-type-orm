import { ObjectId } from 'mongodb';
import add from 'date-fns/add';

export const userCreator = (login: string, email, hours: number, id?: string) => {
	return {
		_id: !id ? new ObjectId().toString() : id,
		login,
		email,
		password: 'password',
		salt: 'salt',
		confirmationCode: 'confirmationCode',
		expirationDate: new Date().toISOString(),
		isConfirmed: true,
		createdAt: add(new Date(), {
			hours: hours,
		}),
	};
};
