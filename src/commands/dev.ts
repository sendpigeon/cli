import chalk from "chalk";
import { Command } from "commander";
import { startServer } from "../server.js";

export const devCommand = new Command("dev")
	.description("Start local dev server for email testing")
	.option("-p, --port <port>", "HTTP port", "4100")
	.option("--smtp-port <port>", "SMTP port", "4125")
	.option("--no-smtp", "Disable SMTP server")
	.action((options) => {
		const httpPort = Number(process.env.PORT) || Number(options.port);
		const smtpPort = Number(process.env.SMTP_PORT) || Number(options.smtpPort);
		const enableSmtp = options.smtp !== false;

		console.log("");
		console.log(chalk.magenta("SendPigeon"), "Dev Server");
		console.log("");
		console.log(
			`  API:  ${chalk.cyan(`http://localhost:${httpPort}/v1/emails`)}`,
		);
		console.log(`  UI:   ${chalk.cyan(`http://localhost:${httpPort}`)}`);
		if (enableSmtp) {
			console.log(`  SMTP: ${chalk.cyan(`localhost:${smtpPort}`)}`);
		}
		console.log("");
		console.log(
			chalk.dim(
				"Emails sent to this server will be caught and displayed in the UI.",
			),
		);
		console.log(chalk.dim("Press Ctrl+C to stop."));
		console.log("");

		startServer({ httpPort, smtpPort, enableSmtp });
	});
