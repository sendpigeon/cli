import type { Config } from "./config.js";

export type ApiResponse<T> =
	| { ok: true; data: T }
	| { ok: false; error: string; code?: string };

export async function apiRequest<T>(
	config: Config,
	method: string,
	path: string,
	body?: unknown,
): Promise<ApiResponse<T>> {
	const url = `${config.baseUrl}${path}`;

	try {
		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			const errorBody = await response.json().catch(() => ({}));
			return {
				ok: false,
				error: errorBody.message || `HTTP ${response.status}`,
				code: errorBody.code,
			};
		}

		const data = await response.json();
		return { ok: true, data };
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Unknown error",
		};
	}
}

export type StatusResponse = {
	organization: { id: string; name: string };
	plan: string;
	usage: {
		emailsSent: number;
		emailLimit: number;
		percentUsed: number;
		periodStart: string;
		periodEnd: string;
	};
	apiKey: {
		id: string;
		mode: "live" | "test";
		permission: "full_access" | "sending";
	};
};

export type SendEmailRequest = {
	from?: string;
	to: string | string[];
	subject?: string;
	html?: string;
	text?: string;
	templateId?: string;
	variables?: Record<string, string>;
	cc?: string | string[];
	bcc?: string | string[];
	replyTo?: string;
	tags?: string[];
};

export type SendEmailResponse = {
	id: string;
	status: string;
};

export type TemplateVariable = {
	key: string;
	type: "string" | "number" | "boolean";
	fallbackValue?: string;
};

export type TemplateResponse = {
	id: string;
	templateId: string;
	name: string | null;
	subject: string;
	html: string | null;
	content: Record<string, unknown> | null;
	text: string | null;
	variables: TemplateVariable[];
	status: "draft" | "published";
	createdAt: string;
	updatedAt: string;
};

export type EmailLogResponse = {
	id: string;
	fromAddress: string;
	toAddress: string;
	ccAddress: string | null;
	bccAddress: string | null;
	subject: string;
	status: string;
	isTest: boolean;
	createdAt: string;
	sentAt: string | null;
	deliveredAt: string | null;
	bouncedAt: string | null;
	latencyMs: number | null;
};

export type PaginatedLogsResponse = {
	data: EmailLogResponse[];
	nextCursor: string | null;
};

export type WebhookConfigResponse = {
	url: string | null;
	enabled: boolean;
	hasSecret: boolean;
	events: string[];
};

export type TestWebhookResponse = {
	success: boolean;
	statusCode?: number;
	error?: string;
};

export type WebhookDelivery = {
	id: string;
	emailId: string | null;
	event: string;
	url: string;
	status: string;
	statusCode: number | null;
	attempts: number;
	lastAttemptAt: string | null;
	error: string | null;
	createdAt: string;
};

export type WebhookDeliveriesResponse = {
	deliveries: WebhookDelivery[];
};

export type DomainListItemResponse = {
	id: string;
	name: string;
	status: string;
	verifiedAt: string | null;
	lastCheckedAt: string | null;
	failingSince: string | null;
	createdAt: string;
	inboundEnabled: boolean;
	inboundReady: boolean;
};

export type RecordStatus = {
	found: boolean;
	valid: boolean;
};

export type DomainVerificationResultResponse = {
	domain: {
		id: string;
		name: string;
		status: string;
		verifiedAt: string | null;
		lastCheckedAt: string | null;
		failingSince: string | null;
		createdAt: string;
	};
	verification: {
		verified: boolean;
		dkim: RecordStatus;
		mx: RecordStatus;
		spf: RecordStatus;
		dmarc: RecordStatus;
	};
};
