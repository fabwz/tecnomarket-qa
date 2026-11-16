import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		include: ["testing/**/*.test.ts"],
		reporters: ["default", ["html", { outputDir: "../reports/html" }], "json", "junit"],
		outputFile: {
			json: "../reports/results.json",
			junit: "../reports/junit.xml",
		},
	},
});
