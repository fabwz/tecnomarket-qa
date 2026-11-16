const results = await Bun.file(new URL("../../reports/results.json", import.meta.url)).json();

const total: number = results.numTotalTests;
const passed: number = results.numPassedTests;
const failed: number = results.numFailedTests;
const rate = total === 0 ? 0 : (passed / total) * 100;

console.log(`Total: ${total}  Passed: ${passed}  Failed: ${failed}  Success: ${rate.toFixed(1)}%`);
