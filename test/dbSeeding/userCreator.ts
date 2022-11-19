import { ObjectId } from 'mongodb';
import add from 'date-fns/add';

export const userCreator = (login: string, email, hours: number, id?: string, banned = false) => {
	return {
		_id: !id ? new ObjectId().toString() : id,
		login,
		email,
		password: '$2b$10$oXNwWWUTZ8oBRWpH.87YueahTHSgSnJ1dpQU0kXGezdtcHFXddJmK',
		salt: '$2b$10$oXNwWWUTZ8oBRWpH.87Yue',
		confirmationCode: 'confirmationCode',
		expirationDate: new Date().toISOString(),
		isConfirmed: true,
		isBanned: banned,
		createdAt: add(new Date(), {
			hours: hours,
		}),
	};
};
