import { createHmac, timingSafeEqual } from "node:crypto";

export type WebhookEvent =
	| "email.delivered"
	| "email.bounced"
	| "email.complained"
	| "email.opened"
	| "email.clicked"
	| "webhook.test";

export type WebhookPayloadData = {
	emailId?: string;
	toAddress?: string;
	fromAddress?: string;
	subject?: string;
	bounceType?: string;
	complaintType?: string;
	/** Present for email.opened events */
	openedAt?: string;
	/** Present for email.clicked events */
	clickedAt?: string;
	/** URL that was clicked (email.clicked only) */
	linkUrl?: string;
	/** Index of clicked link in email (email.clicked only) */
	linkIndex?: number;
};

export type WebhookPayload = {
	event: WebhookEvent;
	timestamp: string;
	data: WebhookPayloadData;
};

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

type BaseVerifyOptions = {
	payload: string;
	signature: string;
	timestamp: string;
	secret: string;
	maxAge?: number;
};

export type WebhookVerifyOptions = BaseVerifyOptions;
export type InboundWebhookVerifyOptions = BaseVerifyOptions;

export type WebhookVerifyResult =
	| { valid: true; payload: WebhookPayload }
	| { valid: false; error: string };

export type InboundWebhookVerifyResult =
	| { valid: true; payload: InboundEmailEvent }
	| { valid: false; error: string };

const WEBHOOK_MAX_AGE_SECONDS = 300;

type VerifyResult<T> = { valid: true; payload: T } | { valid: false; error: string };

function verifySignature<T>(
	options: BaseVerifyOptions,
	validatePayload?: (parsed: unknown) => T | null,
): VerifyResult<T> {
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

	const expected = createHmac("sha256", secret)
		.update(`${ts}.${payload}`)
		.digest("hex");

	try {
		const sigBuffer = Buffer.from(signature, "hex");
		const expectedBuffer = Buffer.from(expected, "hex");

		if (sigBuffer.length !== expectedBuffer.length) {
			return { valid: false, error: "Invalid signature" };
		}

		if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
			return { valid: false, error: "Invalid signature" };
		}
	} catch {
		return { valid: false, error: "Invalid signature format" };
	}

	try {
		const parsed = JSON.parse(payload);
		if (validatePayload) {
			const validated = validatePayload(parsed);
			if (validated === null) {
				return { valid: false, error: "Invalid event type" };
			}
			return { valid: true, payload: validated };
		}
		return { valid: true, payload: parsed as T };
	} catch {
		return { valid: false, error: "Invalid payload JSON" };
	}
}

/** Verify a SendPigeon webhook signature. Requires Node.js. */
export function verifyWebhook(options: WebhookVerifyOptions): WebhookVerifyResult {
	return verifySignature<WebhookPayload>(options);
}

/** Verify an inbound email webhook signature. Requires Node.js. */
export function verifyInboundWebhook(options: InboundWebhookVerifyOptions): InboundWebhookVerifyResult {
	return verifySignature<InboundEmailEvent>(options, (parsed) => {
		const event = parsed as InboundEmailEvent;
		return event.event === "email.received" ? event : null;
	});
}
