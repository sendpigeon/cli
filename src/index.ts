const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Attachment = {
	filename: string;
	contentType?: string;
} & ({ content: string } | { path: string });

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
	attachments?: Attachment[];
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

export type SendPigeonOptions = {
	baseUrl?: string;
};

export type SendPigeonError = {
	message: string;
	code: "network_error" | "api_error";
	status?: number;
};

export type Result<T> =
	| { data: T; error: null }
	| { data: null; error: SendPigeonError };

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
): Promise<Result<T>> {
	try {
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
			return {
				data: null,
				error: { message, code: "api_error", status: response.status },
			};
		}

		if (response.status === 204) {
			return { data: undefined as T, error: null };
		}

		const data = (await response.json()) as T;
		return { data, error: null };
	} catch (err) {
		return {
			data: null,
			error: {
				message: err instanceof Error ? err.message : "Unknown error",
				code: "network_error",
			},
		};
	}
}

export class SendPigeon {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	readonly templates: {
		list: () => Promise<Result<Template[]>>;
		create: (data: CreateTemplateRequest) => Promise<Result<Template>>;
		get: (id: string) => Promise<Result<Template>>;
		update: (
			id: string,
			data: UpdateTemplateRequest,
		) => Promise<Result<Template>>;
		delete: (id: string) => Promise<Result<void>>;
	};

	constructor(apiKey: string, options?: SendPigeonOptions) {
		this.apiKey = apiKey;
		this.baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;

		this.templates = {
			list: () =>
				request<Template[]>(this.baseUrl, this.apiKey, "GET", "/v1/templates"),
			create: (data) =>
				request<Template>(
					this.baseUrl,
					this.apiKey,
					"POST",
					"/v1/templates",
					data,
				),
			get: (id) =>
				request<Template>(
					this.baseUrl,
					this.apiKey,
					"GET",
					`/v1/templates/${id}`,
				),
			update: (id, data) =>
				request<Template>(
					this.baseUrl,
					this.apiKey,
					"PATCH",
					`/v1/templates/${id}`,
					data,
				),
			delete: (id) =>
				request<void>(this.baseUrl, this.apiKey, "DELETE", `/v1/templates/${id}`),
		};
	}

	send(
		email: SendEmailRequest,
		options?: SendEmailOptions,
	): Promise<Result<SendEmailResponse>> {
		return request<SendEmailResponse>(
			this.baseUrl,
			this.apiKey,
			"POST",
			"/v1/emails",
			email,
			{
				...(options?.idempotencyKey && {
					"idempotency-key": options.idempotencyKey,
				}),
			},
		);
	}
}
