import type { components } from "./generated/schema.js";

const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// Internal API types (snake_case)
type ApiSendEmailRequest = components["schemas"]["SendEmailRequest"];
type ApiSendEmailResponse = components["schemas"]["SendEmailResponse"];
type ApiBatchEmailEntry = components["schemas"]["BatchEmailEntry"];

// Public SDK types (camelCase)
export type SendEmailRequest = Omit<ApiSendEmailRequest, "scheduled_at"> & {
	/** ISO 8601 datetime to send. Max 30 days ahead. */
	scheduledAt?: string;
};

export type SendEmailResponse = Omit<ApiSendEmailResponse, "scheduled_at"> & {
	/** Scheduled send time (only if scheduled) */
	scheduledAt?: string;
};

export type BatchEmail = Omit<ApiBatchEmailEntry, "scheduled_at"> & {
	/** ISO 8601 datetime to send. Max 30 days ahead. */
	scheduledAt?: string;
};
export type Template = components["schemas"]["Template"];
export type CreateTemplateRequest = components["schemas"]["CreateTemplateRequest"];
export type UpdateTemplateRequest = components["schemas"]["UpdateTemplateRequest"];
export type AttachmentInput = components["schemas"]["AttachmentInput"];

// Domain types
export type Domain = components["schemas"]["Domain"];
export type DomainListItem = components["schemas"]["DomainListItem"];
export type DomainWithDnsRecords = components["schemas"]["DomainWithDnsRecords"];
export type DomainVerificationResult =
	components["schemas"]["DomainVerificationResult"];
export type DnsRecord = components["schemas"]["DnsRecord"];

/** Options for creating a new domain */
export type CreateDomainOptions = {
	/** Domain name (e.g. "mail.example.com") */
	name: string;
};

// API Key types
export type ApiKey = components["schemas"]["ApiKey"];
export type ApiKeyWithSecret = components["schemas"]["ApiKeyWithSecret"];

/** Options for creating a new API key */
export type CreateApiKeyOptions = {
	/** Human-readable name for this key */
	name: string;
	/** live = production emails, test = sandbox (default: live) */
	mode?: "live" | "test";
	/** full_access = all endpoints, sending = only /v1/emails (default: full_access) */
	permission?: "full_access" | "sending";
	/** ISO datetime when key expires (optional) */
	expiresAt?: string;
	/** Restrict key to send only from this domain (optional) */
	domainId?: string;
};

// Batch email types
export type BatchEmailResult = components["schemas"]["BatchEmailResult"];
export type SendBatchResponse = components["schemas"]["SendBatchEmailResponse"];

// Email detail types
export type EmailDetail = components["schemas"]["EmailDetailResponse"];
export type AttachmentMeta = components["schemas"]["AttachmentMeta"];
export type EmailStatus = EmailDetail["status"];

// SDK-specific types
export type SendEmailOptions = {
	idempotencyKey?: string;
};

export type SendPigeonOptions = {
	baseUrl?: string;
	/** Request timeout in milliseconds (default: 30000) */
	timeout?: number;
	/** Max retries on 429/5xx errors (default: 2, max: 5). Set to 0 to disable. */
	maxRetries?: number;
	/** Log requests and responses to console (default: false) */
	debug?: boolean;
};

export type SendPigeonError = {
	message: string;
	code: "network_error" | "api_error" | "timeout_error";
	/** API error code from server (e.g. QUOTA_EXCEEDED, DOMAIN_NOT_VERIFIED) */
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
	// Exponential backoff: 500ms, 1s, 2s, 4s, 8s
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

			// Retry on network errors too
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

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 2;
const MAX_RETRIES_LIMIT = 5;

// Transform SDK request (camelCase) to API request (snake_case)
function toApiRequest(
	email: SendEmailRequest,
): ApiSendEmailRequest {
	const { scheduledAt, ...rest } = email;
	return scheduledAt ? { ...rest, scheduled_at: scheduledAt } : rest;
}

// Transform API response (snake_case) to SDK response (camelCase)
function fromApiResponse(
	response: ApiSendEmailResponse,
): SendEmailResponse {
	const { scheduled_at, ...rest } = response;
	return scheduled_at ? { ...rest, scheduledAt: scheduled_at } : rest;
}

// Transform batch emails
function toApiBatchRequest(
	emails: BatchEmail[],
): ApiBatchEmailEntry[] {
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
		update: (
			id: string,
			data: UpdateTemplateRequest,
		) => Promise<Result<Template>>;
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
		/** Get email details by ID */
		get: (id: string) => Promise<Result<EmailDetail>>;
		/** Cancel a scheduled email before it is sent */
		cancel: (id: string) => Promise<Result<void>>;
	};

	constructor(apiKey: string, options?: SendPigeonOptions) {
		this.apiKey = apiKey;
		this.baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
		this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
		this.maxRetries = Math.min(options?.maxRetries ?? DEFAULT_MAX_RETRIES, MAX_RETRIES_LIMIT);
		this.debug = options?.debug ?? false;

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

	/** Send up to 100 emails in a single request. Returns per-email status. */
	sendBatch(emails: BatchEmail[]): Promise<Result<SendBatchResponse>> {
		return this._request<SendBatchResponse>({
			method: "POST",
			path: "/v1/emails/batch",
			body: { emails: toApiBatchRequest(emails) },
		});
	}
}

// Outbound webhook types
export type WebhookEvent =
	| "email.delivered"
	| "email.bounced"
	| "email.complained"
	| "webhook.test";

export type WebhookPayloadData = {
	emailId?: string;
	toAddress?: string;
	fromAddress?: string;
	subject?: string;
	bounceType?: string;
	complaintType?: string;
};

export type WebhookPayload = {
	event: WebhookEvent;
	timestamp: string;
	data: WebhookPayloadData;
};

// Inbound webhook types
export type InboundAttachment = {
	filename: string;
	contentType: string;
	size: number;
	/** Presigned URL (expires after 1 hour) */
	url: string;
};

export type InboundEmailData = {
	id: string;
	from: string;
	to: string;
	subject: string;
	text: string | null;
	html: string | null;
	attachments: InboundAttachment[];
	/** Presigned URL to raw email (expires after 1 hour) */
	rawUrl: string;
};

export type InboundEmailEvent = {
	event: "email.received";
	timestamp: string;
	data: InboundEmailData;
};

export type WebhookVerifyOptions = {
	/** Raw request body as string */
	payload: string;
	/** X-Webhook-Signature header value */
	signature: string;
	/** X-Webhook-Timestamp header value */
	timestamp: string;
	/** Webhook secret (whsec_...) */
	secret: string;
	/** Max age in seconds (default: 300) */
	maxAge?: number;
};

export type WebhookVerifyResult =
	| { valid: true; payload: WebhookPayload }
	| { valid: false; error: string };

const WEBHOOK_MAX_AGE_SECONDS = 300;

/**
 * Verify a SendPigeon webhook signature.
 * Use this in your webhook endpoint before processing events.
 * Requires Node.js runtime (uses node:crypto).
 *
 * @example
 * ```ts
 * import { verifyWebhook } from "sendpigeon";
 *
 * app.post("/webhook", async (req, res) => {
 *   const result = await verifyWebhook({
 *     payload: req.body,
 *     signature: req.headers["x-webhook-signature"],
 *     timestamp: req.headers["x-webhook-timestamp"],
 *     secret: process.env.WEBHOOK_SECRET,
 *   });
 *
 *   if (!result.valid) {
 *     return res.status(400).json({ error: result.error });
 *   }
 *
 *   // Process result.payload
 * });
 * ```
 */
export async function verifyWebhook(
	options: WebhookVerifyOptions,
): Promise<WebhookVerifyResult> {
	const { payload, signature, timestamp, secret, maxAge = WEBHOOK_MAX_AGE_SECONDS } = options;

	const ts = parseInt(timestamp, 10);
	if (isNaN(ts)) {
		return { valid: false, error: "Invalid timestamp" };
	}

	const now = Math.floor(Date.now() / 1000);
	const age = now - ts;

	if (age > maxAge) {
		return { valid: false, error: "Timestamp expired" };
	}
	if (age < -maxAge) {
		return { valid: false, error: "Timestamp too far in future" };
	}

	const crypto = await import("node:crypto");
	const expected = crypto
		.createHmac("sha256", secret)
		.update(`${ts}.${payload}`)
		.digest("hex");

	try {
		const sigBuffer = Buffer.from(signature, "hex");
		const expectedBuffer = Buffer.from(expected, "hex");

		if (sigBuffer.length !== expectedBuffer.length) {
			return { valid: false, error: "Invalid signature" };
		}

		if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
			return { valid: false, error: "Invalid signature" };
		}
	} catch {
		return { valid: false, error: "Invalid signature format" };
	}

	try {
		const parsed = JSON.parse(payload) as WebhookPayload;
		return { valid: true, payload: parsed };
	} catch {
		return { valid: false, error: "Invalid payload JSON" };
	}
}

export type InboundWebhookVerifyOptions = {
	/** Raw request body as string */
	payload: string;
	/** X-Webhook-Signature header value */
	signature: string;
	/** X-Webhook-Timestamp header value */
	timestamp: string;
	/** Inbound webhook secret */
	secret: string;
	/** Max age in seconds (default: 300) */
	maxAge?: number;
};

export type InboundWebhookVerifyResult =
	| { valid: true; payload: InboundEmailEvent }
	| { valid: false; error: string };

/**
 * Verify an inbound email webhook signature.
 * Use this in your webhook endpoint to receive incoming emails.
 * Requires Node.js runtime (uses node:crypto).
 *
 * @example
 * ```ts
 * import { verifyInboundWebhook } from "sendpigeon";
 *
 * app.post("/inbound", async (req, res) => {
 *   const result = await verifyInboundWebhook({
 *     payload: req.body,
 *     signature: req.headers["x-webhook-signature"],
 *     timestamp: req.headers["x-webhook-timestamp"],
 *     secret: process.env.INBOUND_WEBHOOK_SECRET,
 *   });
 *
 *   if (!result.valid) {
 *     return res.status(400).json({ error: result.error });
 *   }
 *
 *   const { from, to, subject, text, html, attachments } = result.payload.data;
 *   console.log(`Email from ${from}: ${subject}`);
 *
 *   res.status(200).json({ received: true });
 * });
 * ```
 */
export async function verifyInboundWebhook(
	options: InboundWebhookVerifyOptions,
): Promise<InboundWebhookVerifyResult> {
	const { payload, signature, timestamp, secret, maxAge = WEBHOOK_MAX_AGE_SECONDS } = options;

	const ts = parseInt(timestamp, 10);
	if (isNaN(ts)) {
		return { valid: false, error: "Invalid timestamp" };
	}

	const now = Math.floor(Date.now() / 1000);
	const age = now - ts;

	if (age > maxAge) {
		return { valid: false, error: "Timestamp expired" };
	}
	if (age < -maxAge) {
		return { valid: false, error: "Timestamp too far in future" };
	}

	const crypto = await import("node:crypto");
	const expected = crypto
		.createHmac("sha256", secret)
		.update(`${ts}.${payload}`)
		.digest("hex");

	try {
		const sigBuffer = Buffer.from(signature, "hex");
		const expectedBuffer = Buffer.from(expected, "hex");

		if (sigBuffer.length !== expectedBuffer.length) {
			return { valid: false, error: "Invalid signature" };
		}

		if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
			return { valid: false, error: "Invalid signature" };
		}
	} catch {
		return { valid: false, error: "Invalid signature format" };
	}

	try {
		const parsed = JSON.parse(payload) as InboundEmailEvent;
		if (parsed.event !== "email.received") {
			return { valid: false, error: "Invalid event type" };
		}
		return { valid: true, payload: parsed };
	} catch {
		return { valid: false, error: "Invalid payload JSON" };
	}
}
