import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SendPigeon, SendPigeonError, type Template } from "./index.js";

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

	it("returns email response", async () => {
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
		const result = await client.send({
			from: "test@example.com",
			to: "recipient@example.com",
			subject: "Test",
			html: "<p>Hello</p>",
		});

		expect(result).toEqual({
			id: "email-123",
			status: "pending",
			suppressed: ["blocked@example.com"],
		});
	});
});

describe("SendPigeonError", () => {
	it("has status property", () => {
		const error = new SendPigeonError("Not found", 404);
		expect(error.status).toBe(404);
		expect(error.message).toBe("Not found");
		expect(error.name).toBe("SendPigeonError");
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

	it("throws SendPigeonError for non-2xx responses", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 401,
			json: () => Promise.resolve({ message: "Invalid API key" }),
		});

		const client = new SendPigeon("bad-key");

		await expect(
			client.send({
				from: "test@example.com",
				to: "recipient@example.com",
				subject: "Test",
				html: "<p>Hello</p>",
			}),
		).rejects.toThrow(SendPigeonError);
	});

	it("includes error message from response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 400,
			json: () => Promise.resolve({ message: "Invalid email format" }),
		});

		const client = new SendPigeon("test-key");

		try {
			await client.send({
				from: "test@example.com",
				to: "recipient@example.com",
				subject: "Test",
				html: "<p>Hello</p>",
			});
		} catch (e) {
			expect(e).toBeInstanceOf(SendPigeonError);
			expect((e as SendPigeonError).message).toBe("Invalid email format");
			expect((e as SendPigeonError).status).toBe(400);
		}
	});

	it("handles json parse failure", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.reject(new Error("Invalid JSON")),
		});

		const client = new SendPigeon("test-key");

		try {
			await client.send({
				from: "test@example.com",
				to: "recipient@example.com",
				subject: "Test",
				html: "<p>Hello</p>",
			});
		} catch (e) {
			expect(e).toBeInstanceOf(SendPigeonError);
			expect((e as SendPigeonError).message).toBe("Request failed: 500");
			expect((e as SendPigeonError).status).toBe(500);
		}
	});
});

describe("templates", () => {
	const mockFetch = vi.fn();
	const mockTemplate: Template = {
		id: "tpl_abc123",
		name: "welcome-email",
		subject: "Welcome {{name}}!",
		html: "<p>Hello {{name}}</p>",
		text: null,
		variables: ["name"],
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
		const templates = await client.templates.list();

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates",
			expect.objectContaining({ method: "GET" }),
		);
		expect(templates).toEqual([mockTemplate]);
	});

	it("create makes POST to /v1/templates", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 201,
			json: () => Promise.resolve(mockTemplate),
		});

		const client = new SendPigeon("test-key");
		const template = await client.templates.create({
			name: "welcome-email",
			subject: "Welcome {{name}}!",
			html: "<p>Hello {{name}}</p>",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "welcome-email",
					subject: "Welcome {{name}}!",
					html: "<p>Hello {{name}}</p>",
				}),
			}),
		);
		expect(template).toEqual(mockTemplate);
	});

	it("get makes GET to /v1/templates/{id}", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () => Promise.resolve(mockTemplate),
		});

		const client = new SendPigeon("test-key");
		const template = await client.templates.get("tpl_abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({ method: "GET" }),
		);
		expect(template).toEqual(mockTemplate);
	});

	it("update makes PATCH to /v1/templates/{id}", async () => {
		const updatedTemplate = { ...mockTemplate, subject: "Updated subject" };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: () => Promise.resolve(updatedTemplate),
		});

		const client = new SendPigeon("test-key");
		const template = await client.templates.update("tpl_abc123", {
			subject: "Updated subject",
		});

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({
				method: "PATCH",
				body: JSON.stringify({ subject: "Updated subject" }),
			}),
		);
		expect(template).toEqual(updatedTemplate);
	});

	it("delete makes DELETE to /v1/templates/{id}", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			status: 204,
		});

		const client = new SendPigeon("test-key");
		await client.templates.delete("tpl_abc123");

		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.sendpigeon.dev/v1/templates/tpl_abc123",
			expect.objectContaining({ method: "DELETE" }),
		);
	});

	it("throws SendPigeonError for 404 on get", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			json: () => Promise.resolve({ message: "Template not found" }),
		});

		const client = new SendPigeon("test-key");

		await expect(client.templates.get("nonexistent")).rejects.toThrow(
			SendPigeonError,
		);
	});
});
