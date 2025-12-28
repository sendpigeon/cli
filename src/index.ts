import type { components } from "./generated/schema.js";
import { type HttpMethod, buildQueryString, request } from "./http.js";
import { processReactEmail } from "./react.js";
import type * as types from "./types.js";

export * from "./types.js";
export * from "./webhooks.js";

const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";
const DEV_BASE_URL = "http://localhost:4100";
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 2;
const MAX_RETRIES_LIMIT = 5;

type ApiSendEmailRequest = components["schemas"]["SendEmailRequest"];
type ApiSendEmailResponse = components["schemas"]["SendEmailResponse"];
type ApiBatchEmailEntry = components["schemas"]["BatchEmailEntry"];

function resolveBaseUrl(baseUrl?: string): { url: string; isDevMode: boolean } {
	if (baseUrl) {
		return { url: baseUrl, isDevMode: false };
	}
	if (process.env.SENDPIGEON_DEV === "true") {
		return { url: DEV_BASE_URL, isDevMode: true };
	}
	return { url: DEFAULT_BASE_URL, isDevMode: false };
}

function toApiRequest(email: types.SendEmailRequest): ApiSendEmailRequest {
	const { scheduledAt, ...rest } = email;
	return scheduledAt ? { ...rest, scheduled_at: scheduledAt } : rest;
}

function fromApiResponse(
	response: ApiSendEmailResponse,
): types.SendEmailResponse {
	const { scheduled_at, ...rest } = response;
	return scheduled_at ? { ...rest, scheduledAt: scheduled_at } : rest;
}

function toApiBatchRequest(emails: types.BatchEmail[]): ApiBatchEmailEntry[] {
	return emails.map((email) => {
		const { scheduledAt, ...rest } = email;
		return scheduledAt ? { ...rest, scheduled_at: scheduledAt } : rest;
	});
}

export class SendPigeon {
	private readonly apiKey: string;
	private readonly baseUrl: string;
	private readonly timeout: number;
	private readonly maxRetries: number;
	private readonly debug: boolean;

	readonly templates = {
		list: () => this.req<types.Template[]>("GET", "/v1/templates"),
		create: (data: types.CreateTemplateRequest) =>
			this.req<types.Template>("POST", "/v1/templates", data),
		get: (id: string) => this.req<types.Template>("GET", `/v1/templates/${id}`),
		update: (id: string, data: types.UpdateTemplateRequest) =>
			this.req<types.Template>("PATCH", `/v1/templates/${id}`, data),
		delete: (id: string) => this.req<void>("DELETE", `/v1/templates/${id}`),
		publish: (id: string) =>
			this.req<types.Template>("POST", `/v1/templates/${id}/publish`),
		unpublish: (id: string) =>
			this.req<types.Template>("POST", `/v1/templates/${id}/unpublish`),
		test: (id: string, data: types.TestTemplateRequest) =>
			this.req<{ message: string; emailId: string }>(
				"POST",
				`/v1/templates/${id}/test`,
				data,
			),
	};

	readonly domains = {
		list: () => this.req<types.DomainListItem[]>("GET", "/v1/domains"),
		create: (opts: types.CreateDomainOptions) =>
			this.req<types.DomainWithDnsRecords>("POST", "/v1/domains", opts),
		get: (id: string) =>
			this.req<types.DomainWithDnsRecords>("GET", `/v1/domains/${id}`),
		verify: (id: string) =>
			this.req<types.DomainVerificationResult>(
				"POST",
				`/v1/domains/${id}/verify`,
			),
		delete: (id: string) => this.req<void>("DELETE", `/v1/domains/${id}`),
	};

	readonly apiKeys = {
		list: () => this.req<types.ApiKey[]>("GET", "/v1/api-keys"),
		create: (opts: types.CreateApiKeyOptions) =>
			this.req<types.ApiKeyWithSecret>("POST", "/v1/api-keys", opts),
		delete: (id: string) => this.req<void>("DELETE", `/v1/api-keys/${id}`),
	};

	readonly emails = {
		get: (id: string) => this.req<types.EmailDetail>("GET", `/v1/emails/${id}`),
		cancel: (id: string) =>
			this.req<void>("DELETE", `/v1/emails/${id}/schedule`),
	};

	readonly suppressions = {
		list: (opts?: types.ListSuppressionsOptions) =>
			this.req<types.SuppressionListResponse>(
				"GET",
				`/v1/suppressions${buildQueryString({ limit: opts?.limit, offset: opts?.offset })}`,
			),
		delete: (email: string) =>
			this.req<void>("DELETE", `/v1/suppressions/${encodeURIComponent(email)}`),
	};

	constructor(apiKey: string, options?: types.SendPigeonOptions) {
		this.apiKey = apiKey;
		const { url, isDevMode } = resolveBaseUrl(options?.baseUrl);
		this.baseUrl = url;
		this.timeout = options?.timeout ?? DEFAULT_TIMEOUT;
		this.maxRetries = Math.min(
			options?.maxRetries ?? DEFAULT_MAX_RETRIES,
			MAX_RETRIES_LIMIT,
		);
		this.debug = options?.debug ?? false;

		if (isDevMode) {
			const purple = "\x1b[35m";
			const reset = "\x1b[0m";
			console.log(
				`${purple}[SendPigeon]${reset} Dev mode → http://localhost:4100`,
			);
		}
	}

	private req<T>(
		method: HttpMethod,
		path: string,
		body?: unknown,
		headers?: Record<string, string>,
	): Promise<types.Result<T>> {
		return request<T>({
			baseUrl: this.baseUrl,
			apiKey: this.apiKey,
			timeout: this.timeout,
			maxRetries: this.maxRetries,
			debug: this.debug,
			method,
			path,
			body,
			headers,
		});
	}

	async send(
		emailInput: types.SendEmailRequest,
		options?: types.SendEmailOptions,
	): Promise<types.Result<types.SendEmailResponse>> {
		const processed = await processReactEmail(emailInput);
		if (processed.error) {
			return processed;
		}

		const headers = options?.idempotencyKey
			? { "idempotency-key": options.idempotencyKey }
			: undefined;

		const result = await this.req<ApiSendEmailResponse>(
			"POST",
			"/v1/emails",
			toApiRequest(processed.data),
			headers,
		);

		if (result.error) {
			return result;
		}

		return { data: fromApiResponse(result.data), error: null };
	}

	async sendBatch(
		emails: types.BatchEmail[],
	): Promise<types.Result<types.SendBatchResponse>> {
		const processedEmails: types.BatchEmail[] = [];

		for (const email of emails) {
			const processed = await processReactEmail(email);
			if (processed.error) {
				return processed;
			}
			processedEmails.push(processed.data);
		}

		return this.req<types.SendBatchResponse>("POST", "/v1/emails/batch", {
			emails: toApiBatchRequest(processedEmails),
		});
	}
}
