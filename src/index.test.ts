import { createHmac } from "node:crypto";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SendPigeon, verifyWebhook, type Template } from "./index.js";

describe("SendPigeon", () => {
	it("has send method", () => {
		const client = new SendPigeon("test-api-key");
		expect(client.send).toBeDefined();
		expect(typeof client.send).toBe("function");
	});

	it("accepts options", () => {
		const client = new SendPigeon("test-api-key", {
			baseUrl: "https://custom.api.com",
		});
		expect(client).toBeDefined();
	});

	it("uses dev server when SENDPIGEON_DEV=true", async () => {
		const mockFetch = vi.fn().mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "dev_123" }),
		});
		vi.stubGlobal("fetch", mockFetch);
		vi.stubEnv("SENDPIGEON_DEV", "true");

		const client = new SendPigeon("test-key");
		await client.send({
			from: "a@b.com",
			to: "c@d.com",
			subject: "Test",
			html: "<p>Hi</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"http://localhost:4100/v1/emails",
			expect.any(Object),
		);

		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it("explicit baseUrl overrides SENDPIGEON_DEV", async () => {
		const mockFetch = vi.fn().mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "123" }),
		});
		vi.stubGlobal("fetch", mockFetch);
		vi.stubEnv("SENDPIGEON_DEV", "true");

		const client = new SendPigeon("test-key", {
			baseUrl: "https://custom.api.com",
		});
		await client.send({
			from: "a@b.com",
			to: "c@d.com",
			subject: "Test",
			html: "<p>Hi</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://custom.api.com/v1/emails",
			expect.any(Object),
		);

		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});
});

describe("send", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("makes POST to /v1/emails", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "email-123", status: "pending" }),
		});

		const client = new SendPigeon("test-key");
		await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/emails",
			expect.objectContaining({
				method: "POST",
			}),
		);
	});

	it("includes Authorization header", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "email-123", status: "pending" }),
		});

		const client = new SendPigeon("my-secret-key");
		await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer my-secret-key",
				}),
			}),
		);
	});

	it("sets idempotency-key header when provided", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "email-123", status: "pending" }),
		});

		const client = new SendPigeon("test-key");
		await client.send(
			{
				from: "test@example.com",
				to: "recipient@example.com",
				subject: "Test",
				html: "<p>Hello</p>",
			},
			{ idempotencyKey: "unique-key-123" },
		);

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					"idempotency-key": "unique-key-123",
				}),
			}),
		);
	});

	it("uses custom baseUrl", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ id: "email-123", status: "pending" }),
		});

		const client = new SendPigeon("test-key", {
			baseUrl: "https://custom.api.com",
		});
		await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://custom.api.com/v1/emails",
			expect.any(Object),
		);
	});

	it("returns data on success", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					id: "email-123",
					status: "pending",
					suppressed: ["blocked@example.com"],
				}),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(error).toBeNull();
		expect(data).toEqual({
			id: "email-123",
			status: "pending",
			suppressed: ["blocked@example.com"],
		});
	});
});

describe("error handling", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("returns error for non-2xx responses", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 401,
			json: () => Promise.resolve({ message: "Invalid API key" }),
		});

		const client = new SendPigeon("bad-key");
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(data).toBeNull();
		expect(error).toEqual({
			message: "Invalid API key",
			code: "api_error",
			status: 401,
		});
	});

	it("includes error message from response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 400,
			json: () => Promise.resolve({ message: "Invalid email format" }),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(data).toBeNull();
		expect(error?.message).toBe("Invalid email format");
		expect(error?.code).toBe("api_error");
		expect(error?.status).toBe(400);
	});

	it("handles json parse failure", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.reject(new Error("Invalid JSON")),
		});

		const client = new SendPigeon("test-key", { maxRetries: 0 });
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(data).toBeNull();
		expect(error?.message).toBe("Request failed: 500");
		expect(error?.code).toBe("api_error");
		expect(error?.status).toBe(500);
	});

	it("handles network errors", async () => {
		mockFetch.mockRejectedValueOnce(new Error("Network error"));

		const client = new SendPigeon("test-key", { maxRetries: 0 });
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(data).toBeNull();
		expect(error?.message).toBe("Network error");
		expect(error?.code).toBe("network_error");
		expect(error?.status).toBeUndefined();
	});

	it("retries on 429 and succeeds", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				status: 429,
				headers: new Map([["retry-after", "0"]]),
				json: () => Promise.resolve({ message: "Rate limited" }),
			})
			.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: () => Promise.resolve({ id: "email_retry", status: "sent", suppressed: [] }),
			});

		const client = new SendPigeon("test-key", { maxRetries: 1 });
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(error).toBeNull();
		expect(data?.id).toBe("email_retry");
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("retries on 5xx and eventually fails", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				status: 500,
				headers: new Map(),
				json: () => Promise.resolve({ message: "Server error" }),
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 500,
				headers: new Map(),
				json: () => Promise.resolve({ message: "Server error" }),
			});

		const client = new SendPigeon("test-key", { maxRetries: 1 });
		const { data, error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(data).toBeNull();
		expect(error?.message).toBe("Server error");
		expect(error?.status).toBe(500);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});

describe("templates", () => {
	const mockFetch = vi.fn();
	const mockTemplate: Template = {
		id: "tpl_abc123",
		templateId: "welcome-email",
		subject: "Welcome {{name}}!",
		html: "<p>Hello {{name}}</p>",
		text: null,
		variables: ["name"],
		domain: null,
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T10:30:00Z",
	};

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("returns client with templates namespace", () => {
		const client = new SendPigeon("test-api-key");
		expect(client.templates).toBeDefined();
		expect(typeof client.templates.list).toBe("function");
		expect(typeof client.templates.create).toBe("function");
		expect(typeof client.templates.get).toBe("function");
		expect(typeof client.templates.update).toBe("function");
		expect(typeof client.templates.delete).toBe("function");
	});

	it("list makes GET to /v1/templates", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () => Promise.resolve([mockTemplate]),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.templates.list();

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates",
			expect.objectContaining({ method: "GET" }),
		);
		expect(error).toBeNull();
		expect(data).toEqual([mockTemplate]);
	});

	it("create makes POST to /v1/templates", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 201,
			json: () => Promise.resolve(mockTemplate),
		});

		const client = new SendPigeon("test-key");
		const { data } = await client.templates.create({
			templateId: "welcome-email",
			subject: "Welcome {{name}}!",
			html: "<p>Hello {{name}}</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					templateId: "welcome-email",
					subject: "Welcome {{name}}!",
					html: "<p>Hello {{name}}</p>",
				}),
			}),
		);
		expect(data).toEqual(mockTemplate);
	});

	it("get makes GET to /v1/templates/{id}", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () => Promise.resolve(mockTemplate),
		});

		const client = new SendPigeon("test-key");
		const { data } = await client.templates.get("tpl_abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({ method: "GET" }),
		);
		expect(data).toEqual(mockTemplate);
	});

	it("update makes PATCH to /v1/templates/{id}", async () => {
		const updatedTemplate = { ...mockTemplate, subject: "Updated subject" };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () => Promise.resolve(updatedTemplate),
		});

		const client = new SendPigeon("test-key");
		const { data } = await client.templates.update("tpl_abc123", {
			subject: "Updated subject",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({
				method: "PATCH",
				body: JSON.stringify({ subject: "Updated subject" }),
			}),
		);
		expect(data).toEqual(updatedTemplate);
	});

	it("delete makes DELETE to /v1/templates/{id}", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 204,
		});

		const client = new SendPigeon("test-key");
		const { error } = await client.templates.delete("tpl_abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({ method: "DELETE" }),
		);
		expect(error).toBeNull();
	});

	it("returns error for 404 on get", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: "Template not found" }),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.templates.get("nonexistent");

		expect(data).toBeNull();
		expect(error).toEqual({
			message: "Template not found",
			code: "api_error",
			status: 404,
		});
	});
});

describe("emails.get", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("makes GET to /v1/emails/{id}", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () =>
				Promise.resolve({
					id: "em_abc123",
					status: "delivered",
					fromAddress: "test@example.com",
					toAddress: "recipient@example.com",
					subject: "Test",
					tags: ["order"],
					metadata: { orderId: "123" },
					createdAt: "2024-01-15T10:00:00Z",
					sentAt: "2024-01-15T10:00:01Z",
					deliveredAt: "2024-01-15T10:00:02Z",
					bouncedAt: null,
					complainedAt: null,
					bounceType: null,
					complaintType: null,
					ccAddress: null,
					bccAddress: null,
					attachments: null,
					hasBody: true,
				}),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.emails.get("em_abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/emails/em_abc123",
			expect.objectContaining({ method: "GET" }),
		);
		expect(error).toBeNull();
		expect(data?.status).toBe("delivered");
		expect(data?.tags).toEqual(["order"]);
		expect(data?.metadata).toEqual({ orderId: "123" });
	});

	it("returns error for 404", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: "Email not found", code: "NOT_FOUND" }),
		});

		const client = new SendPigeon("test-key");
		const { data, error } = await client.emails.get("nonexistent");

		expect(data).toBeNull();
		expect(error?.code).toBe("api_error");
		expect(error?.apiCode).toBe("NOT_FOUND");
		expect(error?.status).toBe(404);
	});
});

describe("apiCode error handling", () => {
	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("returns apiCode from API response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 402,
			json: () =>
				Promise.resolve({
					message: "Quota exceeded",
					code: "QUOTA_EXCEEDED",
				}),
		});

		const client = new SendPigeon("test-key");
		const { error } = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(error?.code).toBe("api_error");
		expect(error?.apiCode).toBe("QUOTA_EXCEEDED");
		expect(error?.status).toBe(402);
	});
});

describe("verifyWebhook", () => {
	const secret = "whsec_test123";

	function sign(payload: string, ts: number): string {
		return createHmac("sha256", secret)
			.update(`${ts}.${payload}`)
			.digest("hex");
	}

	it("returns valid for correct signature", () => {
		const payload = JSON.stringify({
			event: "email.delivered",
			timestamp: new Date().toISOString(),
			data: { emailId: "em_123" },
		});
		const ts = Math.floor(Date.now() / 1000);
		const sig = sign(payload, ts);

		const result = verifyWebhook({
			payload,
			signature: sig,
			timestamp: String(ts),
			secret,
		});

		expect(result.valid).toBe(true);
		if (result.valid) {
			expect(result.payload.event).toBe("email.delivered");
		}
	});

	it("rejects expired timestamp", () => {
		const payload = "{}";
		const ts = Math.floor(Date.now() / 1000) - 400;
		const sig = sign(payload, ts);

		const result = verifyWebhook({
			payload,
			signature: sig,
			timestamp: String(ts),
			secret,
		});

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toBe("Timestamp expired");
		}
	});

	it("rejects invalid signature", () => {
		const payload = "{}";
		const ts = Math.floor(Date.now() / 1000);

		const result = verifyWebhook({
			payload,
			signature: "invalidsignature",
			timestamp: String(ts),
			secret,
		});

		expect(result.valid).toBe(false);
	});

	it("rejects invalid timestamp", () => {
		const result = verifyWebhook({
			payload: "{}",
			signature: "abc123",
			timestamp: "not-a-number",
			secret,
		});

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toBe("Invalid timestamp");
		}
	});

	it("rejects invalid JSON payload", () => {
		const payload = "not json";
		const ts = Math.floor(Date.now() / 1000);
		const sig = sign(payload, ts);

		const result = verifyWebhook({
			payload,
			signature: sig,
			timestamp: String(ts),
			secret,
		});

		expect(result.valid).toBe(false);
		if (!result.valid) {
			expect(result.error).toBe("Invalid payload JSON");
		}
	});
});
