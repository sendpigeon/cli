import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import {
	type TestWebhookResponse,
	type WebhookConfigResponse,
	type WebhookDeliveriesResponse,
	apiRequest,
} from "../api.js";
import { getConfig } from "../config.js";
import { colorStatus, formatTime, truncate } from "../utils.js";

export const webhooksCommand = new Command("webhooks")
	.description("Manage webhooks")
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)")
	.action(async () => {
		const config = getConfig({ apiKey: webhooksCommand.opts().apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching webhook config...").start();

		const result = await apiRequest<WebhookConfigResponse>(
			config,
			"GET",
			"/v1/webhooks",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const wh = result.data;
		console.log("");

		if (!wh.url) {
			console.log(chalk.dim("  Webhook not configured."));
			console.log("");
			return;
		}

		console.log(
			`  ${chalk.dim("Status:")}  ${wh.enabled ? chalk.green("enabled") : chalk.yellow("disabled")}`,
		);
		console.log(`  ${chalk.dim("URL:")}     ${wh.url}`);
		console.log(
			`  ${chalk.dim("Secret:")}  ${wh.hasSecret ? chalk.green("configured") : chalk.red("not set")}`,
		);
		console.log(`  ${chalk.dim("Events:")}  ${wh.events.join(", ") || "none"}`);
		console.log("");
	});

webhooksCommand
	.command("test")
	.description("Send a test webhook")
	.action(async () => {
		const config = getConfig({ apiKey: webhooksCommand.opts().apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Sending test webhook...").start();

		const result = await apiRequest<TestWebhookResponse>(
			config,
			"POST",
			"/v1/webhooks/test",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		const test = result.data;
		if (test.success) {
			spinner.succeed(
				chalk.green(`Test webhook sent (status: ${test.statusCode})`),
			);
		} else {
			spinner.fail(chalk.red(`Test failed: ${test.error}`));
		}
	});

webhooksCommand
	.command("deliveries")
	.description("List recent webhook deliveries")
	.action(async () => {
		const config = getConfig({ apiKey: webhooksCommand.opts().apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching deliveries...").start();

		const result = await apiRequest<WebhookDeliveriesResponse>(
			config,
			"GET",
			"/v1/webhooks/deliveries",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const deliveries = result.data.deliveries;
		if (deliveries.length === 0) {
			console.log(chalk.dim("No deliveries found."));
			return;
		}

		console.log("");
		console.log(
			chalk.dim(
				`  ${"TIME".padEnd(10)} ${"EVENT".padEnd(18)} ${"STATUS".padEnd(12)} CODE`,
			),
		);
		console.log(chalk.dim(`  ${"─".repeat(50)}`));

		for (const d of deliveries) {
			const time = formatTime(d.createdAt);
			const code = d.statusCode ? String(d.statusCode) : "-";
			console.log(
				`  ${time.padEnd(10)} ${truncate(d.event, 18)} ${colorStatus(d.status).padEnd(12)} ${code}`,
			);
		}
		console.log("");
	});
