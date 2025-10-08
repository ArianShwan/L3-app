// This is a test script to demonstrate the usage of the CodeMetrics module on a single file. Take away the comments to use in your own tests. :)

/* const CodeMetrics = require('./src/index');
const fs = require('fs');

const analyzer = new CodeMetrics();
const content = fs.readFileSync('./src/analyzer.js', 'utf8');
const result = analyzer.analyzeFile('./src/analyzer.js', content);

console.log('\n=== COMPLETE ANALYSIS ===');
console.log('File:', result.fileName);
console.log('Language:', result.language);
console.log('\nLines:', result.lines);
console.log('Comments:', result.comments);
console.log('Functions:', result.functions);

console.log(`\nComplexity: ${result.complexity.total}`);
const breakdown = Object.entries(result.complexity.breakdown)
  .map(([name, count]) => `${name}: ${count}`);
console.log(`(${breakdown.join(', ')})`);

console.log(`\nQuality Score: ${result.codeQuality.score}/100`);
console.log(`Issues: ${result.codeQuality.summary.critical} critical, ${result.codeQuality.summary.errors} errors, ${result.codeQuality.summary.warnings} warnings`);

if (result.codeQuality.details.errors.length > 0) {
  console.log('\nErrors:', result.codeQuality.details.errors);
}
*/