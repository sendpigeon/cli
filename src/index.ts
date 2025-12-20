const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type SendEmailRequest = {
	from: string;
	to: string | string[];
	cc?: string | string[];
	bcc?: string | string[];
	subject?: string;
	html?: string;
	text?: string;
	replyTo?: string;
	templateId?: string;
	variables?: Record<string, string>;
	attachments?: Array<{
		filename: string;
		size: number;
		contentType: string;
	}>;
};

export type SendEmailOptions = {
	idempotencyKey?: string;
};

export type EmailStatus =
	| "pending"
	| "sent"
	| "delivered"
	| "bounced"
	| "complained"
	| "failed";

export type SendEmailResponse = {
	id: string;
	status: EmailStatus;
	suppressed?: string[];
};

export type Template = {
	id: string;
	name: string;
	subject: string;
	html: string | null;
	text: string | null;
	variables: string[];
	createdAt: string;
	updatedAt: string;
};

export type CreateTemplateRequest = {
	name: string;
	subject: string;
	html?: string;
	text?: string;
};

export type UpdateTemplateRequest = {
	name?: string;
	subject?: string;
	html?: string | null;
	text?: string | null;
};

export type SendPigeonConfig = {
	apiKey: string;
	baseUrl?: string;
};

export type SendPigeonClient = {
	send: (
		email: SendEmailRequest,
		options?: SendEmailOptions,
	) => Promise<SendEmailResponse>;
	templates: {
		list: () => Promise<Template[]>;
		create: (data: CreateTemplateRequest) => Promise<Template>;
		get: (id: string) => Promise<Template>;
		update: (id: string, data: UpdateTemplateRequest) => Promise<Template>;
		delete: (id: string) => Promise<void>;
	};
};

export class SendPigeonError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "SendPigeonError";
		this.status = status;
	}
}

async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();
		return body?.message ?? `Request failed: ${response.status}`;
	} catch {
		return `Request failed: ${response.status}`;
	}
}

async function request<T>(
	baseUrl: string,
	apiKey: string,
	method: HttpMethod,
	path: string,
	body?: unknown,
	headers?: Record<string, string>,
): Promise<T> {
	const response = await fetch(`${baseUrl}${path}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const message = await parseErrorMessage(response);
		throw new SendPigeonError(message, response.status);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}

export function createSendPigeon(
	config: SendPigeonConfig | string,
): SendPigeonClient {
	const apiKey = typeof config === "string" ? config : config.apiKey;
	const baseUrl =
		typeof config === "string"
			? DEFAULT_BASE_URL
			: (config.baseUrl ?? DEFAULT_BASE_URL);

	return {
		send: (email, options) =>
			request<SendEmailResponse>(baseUrl, apiKey, "POST", "/v1/emails", email, {
				...(options?.idempotencyKey && {
					"idempotency-key": options.idempotencyKey,
				}),
			}),
		templates: {
			list: () => request<Template[]>(baseUrl, apiKey, "GET", "/v1/templates"),
			create: (data) =>
				request<Template>(baseUrl, apiKey, "POST", "/v1/templates", data),
			get: (id) =>
				request<Template>(baseUrl, apiKey, "GET", `/v1/templates/${id}`),
			update: (id, data) =>
				request<Template>(
					baseUrl,
					apiKey,
					"PATCH",
					`/v1/templates/${id}`,
					data,
				),
			delete: (id) =>
				request<void>(baseUrl, apiKey, "DELETE", `/v1/templates/${id}`),
		},
	};
}
