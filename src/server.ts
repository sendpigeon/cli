import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { simpleParser } from "mailparser";
import { SMTPServer } from "smtp-server";
import { addEmail, clearEmails, getEmail, getEmails } from "./storage.js";

type ServerOptions = {
	httpPort: number;
	smtpPort: number;
	enableSmtp: boolean;
};

type EmailRequest = {
	from: string;
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	headers?: Record<string, string>;
	attachments?: Array<{ filename: string; content: string }>;
};

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

export function startServer(options: ServerOptions): void {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const uiPath = join(__dirname, "ui");

	const app = new Hono();

	app.get("/health", (c) => c.json({ status: "ok" }));

	app.post("/v1/emails", async (c) => {
		let body: unknown;
		try {
			body = await c.req.json();
		} catch {
			return c.json({ error: "Invalid JSON body" }, 400);
		}

		const result = parseEmailRequest(body);
		if ("error" in result) {
			return c.json({ error: result.error }, 400);
		}

		const { data } = result;
		const email = addEmail({
			from: data.from,
			to: data.to,
			subject: data.subject,
			html: data.html,
			text: data.text,
			headers: data.headers,
			attachments: data.attachments?.map((a) => ({
				filename: a.filename,
				size: a.content?.length ?? 0,
			})),
			source: "http",
		});
		console.log(`  📧 ${email.from} → ${email.to}: ${email.subject}`);
		return c.json({ id: email.id });
	});

	app.get("/api/emails", (c) => c.json(getEmails()));

	app.get("/api/emails/:id", (c) => {
		const email = getEmail(c.req.param("id"));
		if (!email) {
			return c.json({ error: "Not found" }, 404);
		}
		return c.json(email);
	});

	app.delete("/api/emails", (c) => {
		clearEmails();
		console.log("  🗑️  Cleared all emails");
		return c.json({ ok: true });
	});

	app.use("/*", serveStatic({ root: uiPath }));

	serve({ fetch: app.fetch, port: options.httpPort });

	if (options.enableSmtp) {
		const smtp = new SMTPServer({
			authOptional: true,
			disabledCommands: ["STARTTLS"],
			onData(stream, _session, callback) {
				simpleParser(stream, (err, parsed) => {
					if (err) {
						callback(err);
						return;
					}
					const toAddress = Array.isArray(parsed.to)
						? parsed.to.map((t) => t.text).join(", ")
						: (parsed.to?.text ?? "unknown");

					const email = addEmail({
						from: parsed.from?.text ?? "unknown",
						to: toAddress,
						subject: parsed.subject ?? "(no subject)",
						html: parsed.html || undefined,
						text: parsed.text,
						source: "smtp",
					});
					console.log(
						`  📧 [SMTP] ${email.from} → ${email.to}: ${email.subject}`,
					);
					callback();
				});
			},
		});

		smtp.listen(options.smtpPort);
	}
}
