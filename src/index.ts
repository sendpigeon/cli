import type { components } from "./generated/schema.js";

export * from "./webhooks.js";

const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";
const DEV_BASE_URL = "http://localhost:4100";
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 2;
const MAX_RETRIES_LIMIT = 5;

function resolveBaseUrl(baseUrl?: string): { url: string; isDevMode: boolean } {
	// 1. Explicit override wins
	if (baseUrl) return { url: baseUrl, isDevMode: false };

	// 2. Env var for dev mode (sendpigeon-dev server)
	if (process.env.SENDPIGEON_DEV === "true") {
		return { url: DEV_BASE_URL, isDevMode: true };
	}

	// 3. Production default
	return { url: DEFAULT_BASE_URL, isDevMode: false };
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiSendEmailRequest = components["schemas"]["SendEmailRequest"];
type ApiSendEmailResponse = components["schemas"]["SendEmailResponse"];
type ApiBatchEmailEntry = components["schemas"]["BatchEmailEntry"];

export type SendEmailRequest = Omit<ApiSendEmailRequest, "scheduled_at"> & {
	/** ISO 8601 datetime. Max 30 days ahead. */
	scheduledAt?: string;
};

export type SendEmailResponse = Omit<ApiSendEmailResponse, "scheduled_at"> & {
	scheduledAt?: string;
};

export type BatchEmail = Omit<ApiBatchEmailEntry, "scheduled_at"> & {
	/** ISO 8601 datetime. Max 30 days ahead. */
	scheduledAt?: string;
};

export type Template = components["schemas"]["Template"];
export type CreateTemplateRequest = components["schemas"]["CreateTemplateRequest"];
export type UpdateTemplateRequest = components["schemas"]["UpdateTemplateRequest"];
export type AttachmentInput = components["schemas"]["AttachmentInput"];

export type Domain = components["schemas"]["Domain"];
export type DomainListItem = components["schemas"]["DomainListItem"];
export type DomainWithDnsRecords = components["schemas"]["DomainWithDnsRecords"];
export type DomainVerificationResult = components["schemas"]["DomainVerificationResult"];
export type DnsRecord = components["schemas"]["DnsRecord"];

export type CreateDomainOptions = {
	name: string;
};

export type ApiKey = components["schemas"]["ApiKey"];
export type ApiKeyWithSecret = components["schemas"]["ApiKeyWithSecret"];

export type CreateApiKeyOptions = {
	name: string;
	mode?: "live" | "test";
	permission?: "full_access" | "sending";
	expiresAt?: string;
	domainId?: string;
};

export type BatchEmailResult = components["schemas"]["BatchEmailResult"];
export type SendBatchResponse = components["schemas"]["SendBatchEmailResponse"];

export type EmailDetail = components["schemas"]["EmailDetailResponse"];
export type AttachmentMeta = components["schemas"]["AttachmentMeta"];
export type EmailStatus = EmailDetail["status"];

export type Suppression = {
	id: string;
	email: string;
	reason: string;
	sourceEmailId: string | null;
	createdAt: string;
};

export type SuppressionListResponse = {
	data: Suppression[];
	total: number;
};

export type ListSuppressionsOptions = {
	limit?: number;
	offset?: number;
};

export type SendEmailOptions = {
	idempotencyKey?: string;
};

export type SendPigeonOptions = {
	baseUrl?: string;
	/** Default: 30000 */
	timeout?: number;
	/** Retries on 429/5xx. Default: 2, max: 5. Set 0 to disable. */
	maxRetries?: number;
	debug?: boolean;
};

export type SendPigeonError = {
	message: string;
	code: "network_error" | "api_error" | "timeout_error";
	apiCode?: string;
	status?: number;
};

export type Result<T> =
	| { data: T; error: null }
	| { data: null; error: SendPigeonError };

type ParsedError = { message: string; apiCode?: string };

async function parseError(response: Response): Promise<ParsedError> {
	try {
		const body = await response.json();
		return {
			message: body?.message ?? `Request failed: ${response.status}`,
			apiCode: body?.code,
		};
	} catch {
		return { message: `Request failed: ${response.status}` };
	}
}

type RequestOptions = {
	baseUrl: string;
	apiKey: string;
	method: HttpMethod;
	path: string;
	body?: unknown;
	headers?: Record<string, string>;
	timeout: number;
	maxRetries: number;
	debug: boolean;
};

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number): boolean {
	return status === 429 || status >= 500;
}

function getRetryDelay(attempt: number, retryAfter?: string): number {
	if (retryAfter) {
		const seconds = parseInt(retryAfter, 10);
		if (!isNaN(seconds)) return seconds * 1000;
	}
	return Math.min(500 * Math.pow(2, attempt), 8000);
}

async function request<T>(opts: RequestOptions): Promise<Result<T>> {
	const { maxRetries, debug } = opts;
	let lastError: SendPigeonError | null = null;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

		if (debug) {
			console.log(`[sendpigeon] ${opts.method} ${opts.path}${attempt > 0 ? ` (retry ${attempt})` : ""}`);
			if (opts.body) console.log("[sendpigeon] body:", JSON.stringify(opts.body, null, 2));
		}

		try {
			const response = await fetch(`${opts.baseUrl}${opts.path}`, {
				method: opts.method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${opts.apiKey}`,
					...opts.headers,
				},
				body: opts.body ? JSON.stringify(opts.body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (debug) {
				console.log(`[sendpigeon] ${response.status} ${response.statusText}`);
			}

			if (!response.ok) {
				const { message, apiCode } = await parseError(response);
				lastError = { message, code: "api_error", apiCode, status: response.status };

				if (shouldRetry(response.status) && attempt < maxRetries) {
					const delay = getRetryDelay(attempt, response.headers.get("retry-after") ?? undefined);
					if (debug) console.log(`[sendpigeon] retrying in ${delay}ms...`);
					await sleep(delay);
					continue;
				}

				return { data: null, error: lastError };
			}

			if (response.status === 204) {
				return { data: undefined as T, error: null };
			}

			const data = (await response.json()) as T;
			if (debug) console.log("[sendpigeon] response:", JSON.stringify(data, null, 2));
			return { data, error: null };
		} catch (err) {
			clearTimeout(timeoutId);

			if (err instanceof Error && err.name === "AbortError") {
				lastError = { message: "Request timed out", code: "timeout_error" };
			} else {
				lastError = {
					message: err instanceof Error ? err.message : "Unknown error",
					code: "network_error",
				};
			}

			if (attempt < maxRetries) {
				const delay = getRetryDelay(attempt);
				if (debug) console.log(`[sendpigeon] ${lastError.message}, retrying in ${delay}ms...`);
				await sleep(delay);
				continue;
			}
		}
	}

	return { data: null, error: lastError! };
}

function toApiRequest(email: SendEmailRequest): ApiSendEmailRequest {
	const { scheduledAt, ...rest } = email;
	return scheduledAt ? { ...rest, scheduled_at: scheduledAt } : rest;
}

function fromApiResponse(response: ApiSendEmailResponse): SendEmailResponse {
	const { scheduled_at, ...rest } = response;
	return scheduled_at ? { ...rest, scheduledAt: scheduled_at } : rest;
}

function toApiBatchRequest(emails: BatchEmail[]): ApiBatchEmailEntry[] {
	return emails.map((email) => {
		const { scheduledAt, ...rest } = email;
		return scheduledAt ? { ...rest, scheduled_at: scheduledAt } : rest;
	});
}

type SimpleRequestOptions = {
	method: HttpMethod;
	path: string;
	body?: unknown;
	headers?: Record<string, string>;
};

export class SendPigeon {
	private readonly apiKey: string;
	private readonly baseUrl: string;
	private readonly timeout: number;
	private readonly maxRetries: number;
	private readonly debug: boolean;

	private _request<T>(opts: SimpleRequestOptions): Promise<Result<T>> {
		return request<T>({
			baseUrl: this.baseUrl,
			apiKey: this.apiKey,
			timeout: this.timeout,
			maxRetries: this.maxRetries,
			debug: this.debug,
			...opts,
		});
	}

	readonly templates: {
		list: () => Promise<Result<Template[]>>;
		create: (data: CreateTemplateRequest) => Promise<Result<Template>>;
		get: (id: string) => Promise<Result<Template>>;
		update: (id: string, data: UpdateTemplateRequest) => Promise<Result<Template>>;
		delete: (id: string) => Promise<Result<void>>;
	};

	readonly domains: {
		list: () => Promise<Result<DomainListItem[]>>;
		create: (options: CreateDomainOptions) => Promise<Result<DomainWithDnsRecords>>;
		get: (id: string) => Promise<Result<DomainWithDnsRecords>>;
		verify: (id: string) => Promise<Result<DomainVerificationResult>>;
		delete: (id: string) => Promise<Result<void>>;
	};

	readonly apiKeys: {
		list: () => Promise<Result<ApiKey[]>>;
		create: (options: CreateApiKeyOptions) => Promise<Result<ApiKeyWithSecret>>;
		delete: (id: string) => Promise<Result<void>>;
	};

	readonly emails: {
		get: (id: string) => Promise<Result<EmailDetail>>;
		cancel: (id: string) => Promise<Result<void>>;
	};

	readonly suppressions: {
		list: (options?: ListSuppressionsOptions) => Promise<Result<SuppressionListResponse>>;
		delete: (email: string) => Promise<Result<void>>;
	};

	constructor(apiKey: string, options?: SendPigeonOptions) {
		this.apiKey = apiKey;
		const { url, isDevMode } = resolveBaseUrl(options?.baseUrl);
		this.baseUrl = url;
		this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
		this.maxRetries = Math.min(options?.maxRetries ?? DEFAULT_MAX_RETRIES, MAX_RETRIES_LIMIT);
		this.debug = options?.debug ?? false;

		if (isDevMode) {
			const purple = "\x1b[35m";
			const reset = "\x1b[0m";
			console.log(`${purple}[SendPigeon]${reset} Dev mode → http://localhost:4100`);
		}

		this.templates = {
			list: () => this._request<Template[]>({ method: "GET", path: "/v1/templates" }),
			create: (data) => this._request<Template>({ method: "POST", path: "/v1/templates", body: data }),
			get: (id) => this._request<Template>({ method: "GET", path: `/v1/templates/${id}` }),
			update: (id, data) => this._request<Template>({ method: "PATCH", path: `/v1/templates/${id}`, body: data }),
			delete: (id) => this._request<void>({ method: "DELETE", path: `/v1/templates/${id}` }),
		};

		this.domains = {
			list: () => this._request<DomainListItem[]>({ method: "GET", path: "/v1/domains" }),
			create: (opts) => this._request<DomainWithDnsRecords>({ method: "POST", path: "/v1/domains", body: opts }),
			get: (id) => this._request<DomainWithDnsRecords>({ method: "GET", path: `/v1/domains/${id}` }),
			verify: (id) => this._request<DomainVerificationResult>({ method: "POST", path: `/v1/domains/${id}/verify` }),
			delete: (id) => this._request<void>({ method: "DELETE", path: `/v1/domains/${id}` }),
		};

		this.apiKeys = {
			list: () => this._request<ApiKey[]>({ method: "GET", path: "/v1/api-keys" }),
			create: (opts) => this._request<ApiKeyWithSecret>({ method: "POST", path: "/v1/api-keys", body: opts }),
			delete: (id) => this._request<void>({ method: "DELETE", path: `/v1/api-keys/${id}` }),
		};

		this.emails = {
			get: (id) => this._request<EmailDetail>({ method: "GET", path: `/v1/emails/${id}` }),
			cancel: (id) => this._request<void>({ method: "DELETE", path: `/v1/emails/${id}/schedule` }),
		};

		this.suppressions = {
			list: (opts) => {
				const params = new URLSearchParams();
				if (opts?.limit !== undefined) params.set("limit", String(opts.limit));
				if (opts?.offset !== undefined) params.set("offset", String(opts.offset));
				const query = params.toString();
				return this._request<SuppressionListResponse>({
					method: "GET",
					path: `/v1/suppressions${query ? `?${query}` : ""}`,
				});
			},
			delete: (email) =>
				this._request<void>({ method: "DELETE", path: `/v1/suppressions/${encodeURIComponent(email)}` }),
		};
	}

	async send(email: SendEmailRequest, options?: SendEmailOptions): Promise<Result<SendEmailResponse>> {
		const result = await this._request<ApiSendEmailResponse>({
			method: "POST",
			path: "/v1/emails",
			body: toApiRequest(email),
			headers: options?.idempotencyKey ? { "idempotency-key": options.idempotencyKey } : undefined,
		});

		if (result.error) {
			return { data: null, error: result.error };
		}

		return { data: fromApiResponse(result.data), error: null };
	}

	/** Send up to 100 emails in a single request */
	sendBatch(emails: BatchEmail[]): Promise<Result<SendBatchResponse>> {
		return this._request<SendBatchResponse>({
			method: "POST",
			path: "/v1/emails/batch",
			body: { emails: toApiBatchRequest(emails) },
		});
	}
}
