import chalk from "chalk";

const DEFAULT_BASE_URL = "https://api.sendpigeon.dev";
const DEV_BASE_URL = "http://localhost:4100";

export type Config = {
	apiKey: string;
	baseUrl: string;
};

export function getConfig(options: { apiKey?: string }): Config | null {
	const apiKey = options.apiKey || process.env.SENDPIGEON_API_KEY;

	if (!apiKey) {
		console.error(chalk.red("Error: API key required"));
		console.error("");
		console.error("Provide an API key using one of these methods:");
		console.error("  1. Set SENDPIGEON_API_KEY environment variable");
		console.error("  2. Use --api-key flag");
		console.error("");
		console.error("Get your API key at https://sendpigeon.dev/dashboard");
		return null;
	}

	const isDev = process.env.SENDPIGEON_DEV === "true";
	const baseUrl = isDev ? DEV_BASE_URL : DEFAULT_BASE_URL;

	if (isDev) {
		console.log(chalk.magenta("[SendPigeon]"), `Dev mode → ${DEV_BASE_URL}`);
	}

	return { apiKey, baseUrl };
}

export function maskApiKey(key: string): string {
	if (key.length <= 12) return "***";
	return `${key.slice(0, 8)}...${key.slice(-4)}`;
}
