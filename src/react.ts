/**
 * React Email rendering support with lazy loading.
 * Only loaded when the `react` property is used.
 * Requires @react-email/render as a peer dependency.
 */

import type { Result } from "./types.js";

type RenderResult = {
	html: string;
	text: string;
};

type EmailWithReact = { react?: unknown; html?: string; text?: string };

type RenderFunction = (element: unknown) => Promise<string>;
type PlainTextFunction = (html: string) => string;

let renderFn: RenderFunction | null = null;
let plainTextFn: PlainTextFunction | null = null;

async function loadRenderModule(): Promise<void> {
	if (renderFn !== null) return;

	try {
		const module = await import("@react-email/render");
		renderFn = module.render;
		plainTextFn =
			module.toPlainText ??
			((html: string) => html.replace(/<[^>]*>/g, "").trim());
	} catch {
		throw new Error(
			"Failed to render React component. Install '@react-email/render': npm install @react-email/render",
		);
	}
}

/**
 * Renders a React Email component to HTML and plain text.
 * Lazily loads @react-email/render on first use.
 */
export async function renderReactEmail(
	element: unknown,
): Promise<RenderResult> {
	await loadRenderModule();

	if (!renderFn || !plainTextFn) {
		throw new Error("React Email render module not loaded");
	}

	const html = await renderFn(element);
	const text = plainTextFn(html);

	return { html, text };
}

export async function processReactEmail<T extends EmailWithReact>(
	email: T,
): Promise<Result<Omit<T, "react">>> {
	if (email.react === undefined) {
		return { data: email, error: null };
	}

	if (email.html !== undefined) {
		return {
			data: null,
			error: {
				message: "Cannot use both 'react' and 'html' properties",
				code: "api_error",
			},
		};
	}

	try {
		const { html, text } = await renderReactEmail(email.react);
		const { react: _, ...rest } = email;
		return {
			data: { ...rest, html, text: email.text ?? text } as Omit<T, "react">,
			error: null,
		};
	} catch (err) {
		return {
			data: null,
			error: {
				message: err instanceof Error ? err.message : "React render failed",
				code: "api_error",
			},
		};
	}
}
