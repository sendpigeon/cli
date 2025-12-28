#!/usr/bin/env node
import { startServer } from "./server.js";

const color = {
	purple: "\x1b[35m",
	cyan: "\x1b[36m",
	dim: "\x1b[2m",
	reset: "\x1b[0m",
};

function printHelp(): void {
	console.log(`
${color.purple}sendpigeon${color.reset} - SendPigeon CLI

${color.dim}Usage:${color.reset}
  sendpigeon <command> [options]

${color.dim}Commands:${color.reset}
  dev     Start local dev server for email testing

${color.dim}Options:${color.reset}
  --help  Show this help message

${color.dim}Examples:${color.reset}
  sendpigeon dev
  sendpigeon dev --port 3000
  PORT=3000 sendpigeon dev
`);
}

function printDevBanner(port: number): void {
	console.log("");
	console.log(`${color.purple}SendPigeon${color.reset} Dev Server`);
	console.log("");
	console.log(
		`  API: ${color.cyan}http://localhost:${port}/v1/emails${color.reset}`,
	);
	console.log(`  UI:  ${color.cyan}http://localhost:${port}${color.reset}`);
	console.log("");
	console.log(
		`${color.dim}Emails sent to this server will be caught and displayed in the UI.${color.reset}`,
	);
	console.log(`${color.dim}Press Ctrl+C to stop.${color.reset}`);
	console.log("");
}

function parseArgs(args: string[]): { port?: number; help?: boolean } {
	const result: { port?: number; help?: boolean } = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--help" || arg === "-h") {
			result.help = true;
		} else if (arg === "--port" || arg === "-p") {
			const portStr = args[i + 1];
			if (portStr) {
				result.port = Number.parseInt(portStr, 10);
				i++;
			}
		}
	}

	return result;
}

function main(): void {
	const args = process.argv.slice(2);
	const command = args[0];

	if (!command || command === "--help" || command === "-h") {
		printHelp();
		process.exit(0);
	}

	if (command === "dev") {
		const options = parseArgs(args.slice(1));

		if (options.help) {
			console.log(`
${color.purple}sendpigeon dev${color.reset} - Start local dev server

${color.dim}Usage:${color.reset}
  sendpigeon dev [options]

${color.dim}Options:${color.reset}
  --port, -p  Port to run on (default: 4100, or PORT env var)
  --help, -h  Show this help message

${color.dim}Environment:${color.reset}
  PORT        Port to run on (default: 4100)

${color.dim}Examples:${color.reset}
  sendpigeon dev
  sendpigeon dev --port 3000
  PORT=3000 sendpigeon dev
`);
			process.exit(0);
		}

		const port = options.port || Number(process.env.PORT) || 4100;
		printDevBanner(port);
		startServer({ port });
	} else {
		console.error(`Unknown command: ${command}`);
		console.error('Run "sendpigeon --help" for usage.');
		process.exit(1);
	}
}

main();
