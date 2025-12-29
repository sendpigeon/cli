import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import { type TemplateResponse, apiRequest } from "../api.js";
import { getConfig } from "../config.js";
import { colorStatus, formatRelativeTime, truncate } from "../utils.js";

const TEMPLATES_DIR = "sendpigeon-templates";

export const templatesCommand = new Command("templates")
	.description("Manage email templates")
	.option("--api-key <key>", "API key (or set SENDPIGEON_API_KEY)");

templatesCommand
	.command("list")
	.description("List all templates")
	.action(async () => {
		const config = getConfig({
			apiKey: templatesCommand.opts().apiKey,
		});
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching templates...").start();

		const result = await apiRequest<TemplateResponse[]>(
			config,
			"GET",
			"/v1/templates",
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const templates = result.data;
		if (templates.length === 0) {
			console.log(chalk.dim("No templates found."));
			return;
		}

		console.log("");
		console.log(
			chalk.dim(
				`${"ID".padEnd(24)} ${"NAME".padEnd(20)} ${"STATUS".padEnd(10)} UPDATED`,
			),
		);
		console.log(chalk.dim("─".repeat(70)));

		for (const t of templates) {
			console.log(
				`${truncate(t.templateId, 24)} ${truncate(t.name || "-", 20)} ${colorStatus(t.status).padEnd(10)} ${formatRelativeTime(t.updatedAt)}`,
			);
		}
		console.log("");
	});

templatesCommand
	.command("get <id>")
	.description("Get template details")
	.action(async (id: string) => {
		const config = getConfig({
			apiKey: templatesCommand.opts().apiKey,
		});
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching template...").start();

		const result = await apiRequest<TemplateResponse>(
			config,
			"GET",
			`/v1/templates/${id}`,
		);

		if (!result.ok) {
			spinner.fail(chalk.red(`Failed: ${result.error}`));
			process.exit(1);
		}

		spinner.stop();

		const t = result.data;
		console.log("");
		console.log(`  ${chalk.dim("ID:")}         ${t.templateId}`);
		console.log(`  ${chalk.dim("Name:")}       ${t.name || "-"}`);
		console.log(`  ${chalk.dim("Subject:")}    ${t.subject}`);
		console.log(`  ${chalk.dim("Status:")}     ${colorStatus(t.status)}`);
		console.log(
			`  ${chalk.dim("Updated:")}    ${formatRelativeTime(t.updatedAt)}`,
		);

		if (t.variables.length > 0) {
			console.log(
				`  ${chalk.dim("Variables:")}  ${t.variables.map((v) => v.key).join(", ")}`,
			);
		}
		console.log("");
	});

templatesCommand
	.command("pull")
	.description("Download templates to local directory")
	.option("--id <id>", "Only pull specific template")
	.option("--dir <dir>", "Directory to save templates", TEMPLATES_DIR)
	.action(async (options) => {
		const config = getConfig({
			apiKey: templatesCommand.opts().apiKey,
		});
		if (!config) {
			process.exit(1);
		}

		const spinner = ora("Fetching templates...").start();

		let templates: TemplateResponse[];

		if (options.id) {
			const result = await apiRequest<TemplateResponse>(
				config,
				"GET",
				`/v1/templates/${options.id}`,
			);
			if (!result.ok) {
				spinner.fail(chalk.red(`Failed: ${result.error}`));
				process.exit(1);
			}
			templates = [result.data];
		} else {
			const result = await apiRequest<TemplateResponse[]>(
				config,
				"GET",
				"/v1/templates",
			);
			if (!result.ok) {
				spinner.fail(chalk.red(`Failed: ${result.error}`));
				process.exit(1);
			}
			templates = result.data;
		}

		if (templates.length === 0) {
			spinner.info("No templates to pull.");
			return;
		}

		spinner.text = "Saving templates...";

		const dir = options.dir;
		if (!existsSync(dir)) {
			mkdirSync(dir, { recursive: true });
		}

		for (const t of templates) {
			const templateDir = join(dir, t.templateId);
			if (!existsSync(templateDir)) {
				mkdirSync(templateDir, { recursive: true });
			}

			const metadata = {
				id: t.id,
				templateId: t.templateId,
				name: t.name,
				subject: t.subject,
				variables: t.variables,
				status: t.status,
			};

			writeFileSync(
				join(templateDir, "template.json"),
				JSON.stringify(metadata, null, 2),
			);

			if (t.html) {
				writeFileSync(join(templateDir, "content.html"), t.html);
			}

			if (t.text) {
				writeFileSync(join(templateDir, "content.txt"), t.text);
			}
		}

		spinner.succeed(
			chalk.green(`Pulled ${templates.length} template(s) to ./${dir}/`),
		);
	});

type PushTemplateRequest = {
	templateId: string;
	name?: string;
	subject: string;
	html?: string;
	text?: string;
	variables?: Array<{ key: string; type: string; fallbackValue?: string }>;
};

templatesCommand
	.command("push")
	.description("Upload local templates to SendPigeon")
	.option("--id <id>", "Only push specific template")
	.option("--dir <dir>", "Directory containing templates", TEMPLATES_DIR)
	.action(async (options) => {
		const config = getConfig({
			apiKey: templatesCommand.opts().apiKey,
		});
		if (!config) {
			process.exit(1);
		}

		const dir = options.dir;
		if (!existsSync(dir)) {
			console.error(chalk.red(`Directory not found: ${dir}`));
			console.log(chalk.dim("Run 'sendpigeon templates pull' first."));
			process.exit(1);
		}

		const templateDirs = options.id
			? [options.id]
			: readdirSync(dir).filter((f) =>
					existsSync(join(dir, f, "template.json")),
				);

		if (templateDirs.length === 0) {
			console.log(chalk.dim("No templates to push."));
			return;
		}

		const spinner = ora(
			`Pushing ${templateDirs.length} template(s)...`,
		).start();

		let pushed = 0;
		let failed = 0;

		for (const templateId of templateDirs) {
			const templateDir = join(dir, templateId);
			const metadataPath = join(templateDir, "template.json");

			if (!existsSync(metadataPath)) {
				spinner.text = chalk.yellow(`Skipping ${templateId}: no template.json`);
				failed++;
				continue;
			}

			const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
			const htmlPath = join(templateDir, "content.html");
			const textPath = join(templateDir, "content.txt");

			const request: PushTemplateRequest = {
				templateId: metadata.templateId,
				name: metadata.name,
				subject: metadata.subject,
				variables: metadata.variables,
			};

			if (existsSync(htmlPath)) {
				request.html = readFileSync(htmlPath, "utf-8");
			}
			if (existsSync(textPath)) {
				request.text = readFileSync(textPath, "utf-8");
			}

			const updateResult = await apiRequest<TemplateResponse>(
				config,
				"PATCH",
				`/v1/templates/${templateId}`,
				{
					name: request.name,
					subject: request.subject,
					html: request.html,
					text: request.text,
					variables: request.variables,
				},
			);

			if (updateResult.ok) {
				pushed++;
				continue;
			}

			if (updateResult.code === "NOT_FOUND") {
				const createResult = await apiRequest<TemplateResponse>(
					config,
					"POST",
					"/v1/templates",
					request,
				);

				if (createResult.ok) {
					pushed++;
				} else {
					spinner.text = chalk.yellow(
						`Failed to push ${templateId}: ${createResult.error}`,
					);
					failed++;
				}
			} else {
				spinner.text = chalk.yellow(
					`Failed to push ${templateId}: ${updateResult.error}`,
				);
				failed++;
			}
		}

		if (failed > 0) {
			spinner.warn(
				chalk.yellow(`Pushed ${pushed}/${templateDirs.length} templates`),
			);
		} else {
			spinner.succeed(chalk.green(`Pushed ${pushed} template(s)`));
		}
	});
