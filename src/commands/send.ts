import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import {
	type SendEmailRequest,
	type SendEmailResponse,
	apiRequest,
} from "../api.js";
import { getConfig } from "../config.js";

function parseVariables(vars: string[]): Record<string, string> {
	const result: Record<string, string> = {};
	for (const v of vars) {
		const [key, ...valueParts] = v.split("=");
		if (key && valueParts.length > 0) {
			result[key] = valueParts.join("=");
		}
	}
	return result;
}

export const sendCommand = new Command("send")
	.description("Send an email")
	.requiredOption(
		"--to <email>",
		"Recipient email address(es), comma-separated",
	)
	.option("--from <email>", "Sender email address")
	.option("--subject <subject>", "Email subject")
	.option("--html <html>", "HTML body")
	.option("--text <text>", "Plain text body")
	.option("--template <id>", "Template ID to use")
	.option(
		"--var <key=value>",
		"Template variable (can be repeated)",
		(v, prev: string[]) => [...prev, v],
		[],
	)
	.option("--cc <email>", "CC recipient(s), comma-separated")
	.option("--bcc <email>", "BCC recipient(s), comma-separated")
	.option("--reply-to <email>", "Reply-to address")
	.option(
		"--tag <tag>",
		"Tag (can be repeated, max 5)",
		(v, prev: string[]) => [...prev, v],
		[],
	)
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)")
	.action(async (options) => {
		const config = getConfig({ apiKey: options.apiKey });
		if (!config) {
			process.exit(1);
		}

		// Validate: need subject+content OR template
		if (!options.template && !options.subject) {
			console.error(
				chalk.red("Error: Either --subject or --template is required"),
			);
			process.exit(1);
		}

		if (!options.template && !options.html && !options.text) {
			console.error(
				chalk.red("Error: Either --html, --text, or --template is required"),
			);
			process.exit(1);
		}

		const request: SendEmailRequest = {
			to: options.to.includes(",")
				? options.to.split(",").map((s: string) => s.trim())
				: options.to,
		};

		if (options.from) request.from = options.from;
		if (options.subject) request.subject = options.subject;
		if (options.html) request.html = options.html;
		if (options.text) request.text = options.text;
		if (options.template) request.templateId = options.template;
		if (options.var.length > 0) request.variables = parseVariables(options.var);
		if (options.cc) request.cc = options.cc;
		if (options.bcc) request.bcc = options.bcc;
		if (options.replyTo) request.replyTo = options.replyTo;
		if (options.tag.length > 0) request.tags = options.tag.slice(0, 5);

		const spinner = ora("Sending email...").start();

		const result = await apiRequest<SendEmailResponse>(
			config,
			"POST",
			"/v1/emails",
			request,
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.succeed(chalk.green("Email sent!"));
		console.log("");
		console.log(`  ID:     ${chalk.cyan(result.data.id)}`);
		console.log(`  Status: ${result.data.status}`);
		console.log(`  To:     ${options.to}`);
	});
