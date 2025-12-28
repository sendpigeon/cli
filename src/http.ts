import type { Result, SendPigeonError } from "./types.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
	baseUrl: string;
	apiKey: string;
	method: HttpMethod;
	path: string;
	body?: unknown;
	headers?: Record<string, string>;
	timeout: number;
	maxRetries: number;
	debug: boolean;
};

type ParsedError = { message: string; apiCode?: string };

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetry(status: number): boolean {
	return status === 429 || status >= 500;
}

function getRetryDelay(attempt: number, retryAfter?: string): number {
	if (retryAfter) {
		const seconds = Number.parseInt(retryAfter, 10);
		if (!Number.isNaN(seconds)) {
			return seconds * 1000;
		}
	}
	return Math.min(500 * 2 ** attempt, 8000);
}

async function parseError(response: Response): Promise<ParsedError> {
	try {
		const body = await response.json();
		return {
			message: body?.message ?? `Request failed: ${response.status}`,
			apiCode: body?.code,
		};
	} catch {
		return { message: `Request failed: ${response.status}` };
	}
}

function log(debug: boolean, ...args: unknown[]) {
	if (debug) {
		console.log("[sendpigeon]", ...args);
	}
}

export async function request<T>(opts: RequestOptions): Promise<Result<T>> {
	const { maxRetries, debug } = opts;
	let lastError: SendPigeonError | null = null;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

		log(
			debug,
			`${opts.method} ${opts.path}${attempt > 0 ? ` (retry ${attempt})` : ""}`,
		);
		if (opts.body) {
			log(debug, "body:", JSON.stringify(opts.body, null, 2));
		}

		try {
			const response = await fetch(`${opts.baseUrl}${opts.path}`, {
				method: opts.method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${opts.apiKey}`,
					...opts.headers,
				},
				body: opts.body ? JSON.stringify(opts.body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);
			log(debug, `${response.status} ${response.statusText}`);

			if (!response.ok) {
				const { message, apiCode } = await parseError(response);
				lastError = {
					message,
					code: "api_error",
					apiCode,
					status: response.status,
				};

				if (shouldRetry(response.status) && attempt < maxRetries) {
					const delay = getRetryDelay(
						attempt,
						response.headers.get("retry-after") ?? undefined,
					);
					log(debug, `retrying in ${delay}ms...`);
					await sleep(delay);
					continue;
				}
				return { data: null, error: lastError };
			}

			if (response.status === 204) {
				return { data: undefined as T, error: null };
			}

			const data = (await response.json()) as T;
			log(debug, "response:", JSON.stringify(data, null, 2));
			return { data, error: null };
		} catch (err) {
			clearTimeout(timeoutId);
			lastError =
				err instanceof Error && err.name === "AbortError"
					? { message: "Request timed out", code: "timeout_error" }
					: {
							message: err instanceof Error ? err.message : "Unknown error",
							code: "network_error",
						};

			if (attempt < maxRetries) {
				const delay = getRetryDelay(attempt);
				log(debug, `${lastError.message}, retrying in ${delay}ms...`);
				await sleep(delay);
			}
		}
	}

	return {
		data: null,
		error: lastError ?? { message: "Unknown error", code: "network_error" },
	};
}

export function buildQueryString(params: Record<string, unknown>): string {
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			searchParams.set(key, String(value));
		}
	}
	const query = searchParams.toString();
	return query ? `?${query}` : "";
}
