import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const baselinePath = path.resolve(process.cwd(), 'biome-baseline.json');
let baseline = { errors: 0, warnings: 0 };

try {
    baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
} catch (e) {
    console.warn('Warning: Could not load biome-baseline.json. Using 0 as baseline.');
}

console.log(`Baseline: ${baseline.errors} errors, ${baseline.warnings} warnings.`);

exec('npx biome check src --reporter=summary', { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    const output = stdout + stderr;
    console.log(output);

    // Parse output
    const errorMatch = output.match(/Found (\d+) errors/);
    const warningMatch = output.match(/Found (\d+) warnings/);

    const currentErrors = errorMatch ? parseInt(errorMatch[1], 10) : 0;
    const currentWarnings = warningMatch ? parseInt(warningMatch[1], 10) : 0;

    console.log(`Current Status: ${currentErrors} errors, ${currentWarnings} warnings.`);

    if (currentErrors > baseline.errors) {
        console.error(`\u001b[31mError: New errors introduced! (${currentErrors} > ${baseline.errors})\u001b[0m`);
        console.error('Please fix the new errors or validatethe changes.');
        process.exit(1);
    } else if (currentErrors < baseline.errors) {
        console.log(`\u001b[32mGreat job! You reduced the number of errors from ${baseline.errors} to ${currentErrors}.\u001b[0m`);
        console.log('Consider updating biome-baseline.json to lock in the improvement.');
    } else {
        console.log('\u001b[32mSuccess: Error count is within baseline limits.\u001b[0m');
    }

    process.exit(0);
});
