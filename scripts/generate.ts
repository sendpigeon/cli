import fs from "node:fs";
import path from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const SPEC_URLS = {
	prod: "https://api.sendpigeon.dev/doc",
	local: "http://localhost:3001/doc",
};

async function generate() {
	const env = process.argv[2] === "local" ? "local" : "prod";
	const url = SPEC_URLS[env];

	console.log(`Fetching OpenAPI spec from ${url}...`);

	const ast = await openapiTS(new URL(url));
	const content = astToString(ast);

	const outPath = path.join(
		import.meta.dirname,
		"../src/generated/schema.ts",
	);
	fs.writeFileSync(outPath, content);

	console.log(`Generated ${outPath}`);
}

generate().catch((err) => {
	console.error(err);
	process.exit(1);
});
