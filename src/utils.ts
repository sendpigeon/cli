import chalk from "chalk";

export function formatRelativeTime(date: string): string {
	const d = new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return d.toLocaleDateString();
}

export function formatTime(date: string): string {
	const d = new Date(date);
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function truncate(str: string, len: number): string {
	if (str.length <= len) return str.padEnd(len);
	return `${str.slice(0, len - 1)}…`;
}

export function colorStatus(status: string): string {
	switch (status) {
		case "delivered":
		case "verified":
		case "published":
			return chalk.green(status);
		case "sent":
			return chalk.blue(status);
		case "bounced":
		case "complained":
		case "failed":
			return chalk.red(status);
		case "pending":
		case "draft":
		case "temporary_failure":
			return chalk.yellow(
				status === "temporary_failure" ? "temp fail" : status,
			);
		default:
			return chalk.dim(status);
	}
}

export function statusSymbol(status: string): string {
	switch (status) {
		case "delivered":
		case "verified":
			return chalk.green("✓");
		case "sent":
			return chalk.blue("→");
		case "bounced":
		case "complained":
		case "failed":
			return chalk.red("✗");
		case "pending":
			return chalk.yellow("○");
		default:
			return chalk.dim("?");
	}
}
