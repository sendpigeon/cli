import { nanoid } from "nanoid";

export type Email = {
	id: string;
	from: string;
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	headers?: Record<string, string>;
	attachments?: Array<{ filename: string; size: number }>;
	createdAt: Date;
};

const MAX_EMAILS = 100;
const emails: Email[] = [];

export function addEmail(data: Omit<Email, "id" | "createdAt">): Email {
	const email: Email = {
		...data,
		id: `dev_${nanoid(12)}`,
		createdAt: new Date(),
	};
	emails.unshift(email);
	if (emails.length > MAX_EMAILS) {
		emails.pop();
	}
	return email;
}

export function getEmails(): Email[] {
	return [...emails];
}

export function getEmail(id: string): Email | undefined {
	return emails.find((e) => e.id === id);
}

export function clearEmails(): void {
	emails.length = 0;
}
