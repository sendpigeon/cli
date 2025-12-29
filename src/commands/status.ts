import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { type StatusResponse, apiRequest } from "../api.js";
import { getConfig, maskApiKey } from "../config.js";

export const statusCommand = new Command("status")
	.description("Check API key and account status")
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)")
	.action(async (options) => {
		const config = getConfig({ apiKey: options.apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Checking status...").start();

		const result = await apiRequest<StatusResponse>(
			config,
			"GET",
			"/v1/status",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.succeed(chalk.green("API key valid"));
		console.log("");

		const { organization, plan, usage, apiKey } = result.data;

		console.log(`  ${chalk.dim("Organization:")} ${organization.name}`);
		console.log(`  ${chalk.dim("Plan:")}         ${plan}`);
		console.log(
			`  ${chalk.dim("API Key:")}      ${maskApiKey(config.apiKey)} (${apiKey.mode}, ${apiKey.permission})`,
		);
		console.log("");
		console.log(`  ${chalk.dim("Usage this period:")}`);
		if (usage.emailLimit === null) {
			console.log(
				`    ${usage.emailsSent.toLocaleString()} emails (unlimited)`,
			);
		} else {
			console.log(
				`    ${usage.emailsSent.toLocaleString()} / ${usage.emailLimit.toLocaleString()} emails (${usage.percentUsed}%)`,
			);

			// Progress bar
			const barWidth = 30;
			const filled = Math.round((usage.percentUsed / 100) * barWidth);
			const empty = barWidth - filled;
			const barColor =
				usage.percentUsed > 90
					? chalk.red
					: usage.percentUsed > 70
						? chalk.yellow
						: chalk.green;
			const bar = barColor("█".repeat(filled)) + chalk.dim("░".repeat(empty));
			console.log(`    [${bar}]`);
		}
	});
