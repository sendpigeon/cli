import type { components } from "./generated/schema.js";

type ApiSendEmailRequest = components["schemas"]["SendEmailRequest"];
type ApiSendEmailResponse = components["schemas"]["SendEmailResponse"];
type ApiBatchEmailEntry = components["schemas"]["BatchEmailEntry"];

export type SendEmailRequest = Omit<ApiSendEmailRequest, "scheduled_at"> & {
	/** ISO 8601 datetime. Max 30 days ahead. */
	scheduledAt?: string;
	/**
	 * React Email component to render. Requires @react-email/render peer dependency.
	 * Cannot be used with `html`. Plain text is auto-generated if not provided.
	 * @example
	 * ```tsx
	 * import { WelcomeEmail } from './emails/welcome';
	 * await client.send({
	 *   from: 'hello@app.com',
	 *   to: 'user@example.com',
	 *   subject: 'Welcome!',
	 *   react: WelcomeEmail({ name: 'John' }),
	 * });
	 * ```
	 */
	react?: unknown;
};

export type SendEmailResponse = Omit<ApiSendEmailResponse, "scheduled_at"> & {
	scheduledAt?: string;
};

export type BatchEmail = Omit<ApiBatchEmailEntry, "scheduled_at"> & {
	/** ISO 8601 datetime. Max 30 days ahead. */
	scheduledAt?: string;
	/**
	 * React Email component to render. Requires @react-email/render peer dependency.
	 * Cannot be used with `html`. Plain text is auto-generated if not provided.
	 */
	react?: unknown;
};

export type Template = components["schemas"]["Template"];
export type TemplateVariable = components["schemas"]["TemplateVariable"];
export type TemplateStatus = Template["status"];
export type CreateTemplateRequest =
	components["schemas"]["CreateTemplateRequest"];
export type UpdateTemplateRequest =
	components["schemas"]["UpdateTemplateRequest"];
export type TestTemplateRequest = components["schemas"]["TestTemplateRequest"];
export type AttachmentInput = components["schemas"]["AttachmentInput"];

export type Domain = components["schemas"]["Domain"];
export type DomainListItem = components["schemas"]["DomainListItem"];
export type DomainWithDnsRecords =
	components["schemas"]["DomainWithDnsRecords"];
export type DomainVerificationResult =
	components["schemas"]["DomainVerificationResult"];
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

export type Suppression = components["schemas"]["Suppression"];
export type SuppressionListResponse =
	components["schemas"]["SuppressionListResponse"];

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
