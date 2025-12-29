import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import {
	type DomainListItemResponse,
	type DomainVerificationResultResponse,
	apiRequest,
} from "../api.js";
import { getConfig } from "../config.js";
import { colorStatus } from "../utils.js";

export const domainsCommand = new Command("domains")
	.description("Manage sending domains")
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)");

domainsCommand
	.command("list")
	.description("List all domains")
	.action(async () => {
		const config = getConfig({ apiKey: domainsCommand.opts().apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching domains...").start();

		const result = await apiRequest<DomainListItemResponse[]>(
			config,
			"GET",
			"/v1/domains",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const domains = result.data;
		if (domains.length === 0) {
			console.log(chalk.dim("No domains found."));
			return;
		}

		console.log("");
		console.log(
			chalk.dim(`  ${"DOMAIN".padEnd(30)} ${"STATUS".padEnd(12)} VERIFIED`),
		);
		console.log(chalk.dim(`  ${"─".repeat(55)}`));

		for (const d of domains) {
			const verified = d.verifiedAt
				? new Date(d.verifiedAt).toLocaleDateString()
				: "-";
			console.log(
				`  ${d.name.padEnd(30)} ${colorStatus(d.status).padEnd(12)} ${verified}`,
			);
		}
		console.log("");
	});

domainsCommand
	.command("verify <id>")
	.description("Verify domain DNS records")
	.action(async (id: string) => {
		const config = getConfig({ apiKey: domainsCommand.opts().apiKey });
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Checking DNS records...").start();

		const result = await apiRequest<DomainVerificationResultResponse>(
			config,
			"POST",
			`/v1/domains/${id}/verify`,
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const { domain, verification } = result.data;

		console.log("");
		console.log(
			`  Domain: ${chalk.bold(domain.name)} (${colorStatus(domain.status)})`,
		);
		console.log("");

		const records = [
			{ name: "DKIM", ...verification.dkim },
			{ name: "MX", ...verification.mx },
			{ name: "SPF", ...verification.spf },
			{ name: "DMARC", ...verification.dmarc },
		];

		for (const record of records) {
			let status: string;
			if (record.valid) {
				status = chalk.green("✓ verified");
			} else if (record.found) {
				status = chalk.yellow("⚠ found but invalid");
			} else {
				status = chalk.red("✗ not found");
			}
			console.log(`  ${record.name.padEnd(8)} ${status}`);
		}

		console.log("");

		if (verification.verified) {
			console.log(chalk.green("  ✓ Domain is fully verified!"));
		} else {
			console.log(
				chalk.yellow(
					"  ⚠ Add the missing DNS records to complete verification",
				),
			);
		}
		console.log("");
	});
