import { afterEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import { clearEmails, getEmails } from "./storage.js";

// Extract the parseEmailRequest logic for testing
function parseEmailRequest(
	body: unknown,
): { data: EmailRequest } | { error: string } {
	if (typeof body !== "object" || body === null) {
		return { error: "Invalid request body" };
	}

	const req = body as Record<string, unknown>;

	const checks: [boolean, string][] = [
		[typeof req.from === "string", "from"],
		[typeof req.to === "string" || Array.isArray(req.to), "to"],
		[typeof req.subject === "string", "subject"],
		[
			typeof req.html === "string" || typeof req.text === "string",
			"html or text",
		],
	];

	const missing = checks.filter(([valid]) => !valid).map(([, field]) => field);

	if (missing.length > 0) {
		return { error: `Missing required fields: ${missing.join(", ")}` };
	}

	return {
		data: {
			from: req.from as string,
			to: req.to as string | string[],
			subject: req.subject as string,
			html: typeof req.html === "string" ? req.html : undefined,
			text: typeof req.text === "string" ? req.text : undefined,
			headers: req.headers as Record<string, string> | undefined,
			attachments: req.attachments as EmailRequest["attachments"],
		},
	};
}

type EmailRequest = {
	from: string;
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	headers?: Record<string, string>;
	attachments?: Array<{ filename: string; content: string }>;
};

describe("parseEmailRequest", () => {
	it("parses valid email with html", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Hello",
			html: "<p>Hi</p>",
		});

		expect("data" in result).toBe(true);
		if ("data" in result) {
			expect(result.data.from).toBe("sender@example.com");
			expect(result.data.to).toBe("recipient@example.com");
			expect(result.data.subject).toBe("Hello");
			expect(result.data.html).toBe("<p>Hi</p>");
		}
	});

	it("parses valid email with text", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Hello",
			text: "Plain text",
		});

		expect("data" in result).toBe(true);
		if ("data" in result) {
			expect(result.data.text).toBe("Plain text");
		}
	});

	it("accepts array of recipients", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: ["a@b.com", "c@d.com"],
			subject: "Hello",
			html: "<p>Hi</p>",
		});

		expect("data" in result).toBe(true);
		if ("data" in result) {
			expect(result.data.to).toEqual(["a@b.com", "c@d.com"]);
		}
	});

	it("returns error for null body", () => {
		const result = parseEmailRequest(null);
		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toBe("Invalid request body");
		}
	});

	it("returns error for missing from", () => {
		const result = parseEmailRequest({
			to: "recipient@example.com",
			subject: "Hello",
			html: "<p>Hi</p>",
		});

		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toContain("from");
		}
	});

	it("returns error for missing to", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			subject: "Hello",
			html: "<p>Hi</p>",
		});

		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toContain("to");
		}
	});

	it("returns error for missing subject", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			html: "<p>Hi</p>",
		});

		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toContain("subject");
		}
	});

	it("returns error for missing html and text", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Hello",
		});

		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toContain("html or text");
		}
	});

	it("returns multiple missing fields", () => {
		const result = parseEmailRequest({});

		expect("error" in result).toBe(true);
		if ("error" in result) {
			expect(result.error).toContain("from");
			expect(result.error).toContain("to");
			expect(result.error).toContain("subject");
		}
	});

	it("includes optional headers", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Hello",
			html: "<p>Hi</p>",
			headers: { "X-Custom": "value" },
		});

		expect("data" in result).toBe(true);
		if ("data" in result) {
			expect(result.data.headers).toEqual({ "X-Custom": "value" });
		}
	});

	it("includes optional attachments", () => {
		const result = parseEmailRequest({
			from: "sender@example.com",
			to: "recipient@example.com",
			subject: "Hello",
			html: "<p>Hi</p>",
			attachments: [{ filename: "doc.pdf", content: "base64content" }],
		});

		expect("data" in result).toBe(true);
		if ("data" in result) {
			expect(result.data.attachments).toHaveLength(1);
		}
	});
});
