import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import {
	type EmailLogResponse,
	type PaginatedLogsResponse,
	apiRequest,
} from "../api.js";
import { getConfig } from "../config.js";
import { colorStatus, formatTime, statusSymbol, truncate } from "../utils.js";

export const logsCommand = new Command("logs")
	.description("View email logs")
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)")
	.option(
		"--status <status>",
		"Filter by status (sent, delivered, bounced, complained)",
	)
	.option("--limit <n>", "Number of logs to show", "20")
	.action(async (options) => {
		const config = getConfig({ apiKey: options.apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching logs...").start();

		const params = new URLSearchParams();
		if (options.status) params.set("status", options.status);
		params.set("limit", options.limit);

		const result = await apiRequest<PaginatedLogsResponse>(
			config,
			"GET",
			`/v1/logs?${params.toString()}`,
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const logs = result.data.data;
		if (logs.length === 0) {
			console.log(chalk.dim("No emails found."));
			return;
		}

		console.log("");
		console.log(
			chalk.dim(
				`  ${"TIME".padEnd(10)} ${"STATUS".padEnd(12)} ${"TO".padEnd(28)} SUBJECT`,
			),
		);
		console.log(chalk.dim(`  ${"─".repeat(75)}`));

		for (const log of logs) {
			const time = formatTime(log.sentAt || log.createdAt);
			console.log(
				`  ${time.padEnd(10)} ${colorStatus(log.status).padEnd(12)} ${truncate(log.toAddress, 28)} ${truncate(log.subject, 30)}`,
			);
		}
		console.log("");
	});

logsCommand
	.command("tail")
	.description("Stream logs in real-time")
	.option("--status <status>", "Filter by status")
	.action(async (options) => {
		const maybeConfig = getConfig({
			apiKey: logsCommand.opts().apiKey,
		});
		if (!maybeConfig) {
			process.exit(1);
		}
		const config = maybeConfig;

		console.log("");
		console.log(chalk.dim("Watching for new emails... (Ctrl+C to stop)"));
		console.log("");

		let lastId: string | null = null;
		let isFirstPoll = true;

		async function poll() {
			const params = new URLSearchParams();
			if (options.status) params.set("status", options.status);
			params.set("limit", "10");

			const result = await apiRequest<PaginatedLogsResponse>(
				config,
				"GET",
				`/v1/logs?${params.toString()}`,
			);

			if (!result.ok) {
				console.error(chalk.red(`Error: ${result.error}`));
				return;
			}

			const logs = result.data.data;

			if (isFirstPoll) {
				isFirstPoll = false;
				if (logs.length > 0) {
					lastId = logs[0].id;
				}
				return;
			}

			const newLogs: EmailLogResponse[] = [];
			for (const log of logs) {
				if (log.id === lastId) break;
				newLogs.push(log);
			}

			if (newLogs.length > 0) {
				lastId = newLogs[0].id;
			}

			for (const log of newLogs.reverse()) {
				const time = formatTime(log.sentAt || log.createdAt);
				console.log(
					`[${time}] ${statusSymbol(log.status)} ${log.status.padEnd(10)} ${truncate(log.toAddress, 25)} "${truncate(log.subject, 35)}"`,
				);
			}
		}

		await poll();
		setInterval(poll, 2000);
	});

logsCommand
	.command("get <id>")
	.description("Get email details")
	.action(async (id: string) => {
		const config = getConfig({
			apiKey: logsCommand.opts().apiKey,
		});
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching email...").start();

		const result = await apiRequest<EmailLogResponse>(
			config,
			"GET",
			`/v1/logs/${id}`,
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const e = result.data;
		console.log("");
		console.log(`  ${chalk.dim("ID:")}        ${e.id}`);
		console.log(`  ${chalk.dim("From:")}      ${e.fromAddress}`);
		console.log(`  ${chalk.dim("To:")}        ${e.toAddress}`);
		if (e.ccAddress) console.log(`  ${chalk.dim("CC:")}        ${e.ccAddress}`);
		if (e.bccAddress)
			console.log(`  ${chalk.dim("BCC:")}       ${e.bccAddress}`);
		console.log(`  ${chalk.dim("Subject:")}   ${e.subject}`);
		console.log(`  ${chalk.dim("Status:")}    ${colorStatus(e.status)}`);
		console.log(
			`  ${chalk.dim("Created:")}   ${new Date(e.createdAt).toLocaleString()}`,
		);
		if (e.sentAt)
			console.log(
				`  ${chalk.dim("Sent:")}      ${new Date(e.sentAt).toLocaleString()}`,
			);
		if (e.deliveredAt)
			console.log(
				`  ${chalk.dim("Delivered:")} ${new Date(e.deliveredAt).toLocaleString()}`,
			);
		if (e.bouncedAt)
			console.log(
				`  ${chalk.dim("Bounced:")}   ${new Date(e.bouncedAt).toLocaleString()}`,
			);
		console.log("");
	});
