### HEADS UP!
This is a module written by me, Arian Shwan, Software developer student at Linneaeus University. Bugs may or may not occur.

# Code Metrics Core

A powerful JavaScript module for analyzing code metrics, complexity, and quality across multiple programming languages.

## Features

- **Multi-language Support** - Analyzes 14+ programming languages (JavaScript, Python, Java, C++, PHP, Ruby, Go, and more)
- **Comprehensive Metrics** - Lines of code, comments, functions, and complexity analysis
- **Code Quality Assessment** - Detects errors, warnings, and critical issues with severity scoring
- **Single File Analysis** - Detailed analysis of individual code files
- **Repository Analysis** - Clone and analyze entire GitHub repositories
- **Language Detection** - Automatically identifies programming language from file extension
- **Complexity Breakdown** - Detailed breakdown of cyclomatic complexity by construct type

## Installation

### Prerequisites
- Node.js v22.7.0 or higher
- Git (for repository analysis)

### Install Dependencies

```bash
npm install
```

## Usage

### Analyze a Single File with ModuleTest.js

```javascript
const CodeMetrics = require('./src/index');
const fs = require('fs');

const analyzer = new CodeMetrics();
const content = fs.readFileSync('./myFile.js', 'utf8');
const result = analyzer.analyzeFile('./myFile.js', content);

console.log(result);
```

**Output:**
```javascript
{
  fileName: './myFile.js',
  language: 'javascript',
  lines: { total: 150, empty: 20, code: 130 },
  comments: { total: 25, singleLine: 20, multiLine: 5 },
  complexity: { total: 15, breakdown: { if: 8, for: 3, while: 2 } },
  functions: { count: 5, names: ['funcA', 'funcB', 'funcC', 'funcD', 'funcE'] },
  codeQuality: {
    summary: { critical: 0, errors: 2, warnings: 3, total: 5 },
    details: { critical: [], errors: [...], warnings: [...] },
    score: 75
  }
}
```

### Analyze a GitHub Repository with analyzeGitRepo.js

```javascript
// In test/analyzeGitRepo.js, change the repo URL:
const repoUrl = 'https://github.com/username/repository.git';

// Run:
node test/analyzeGitRepo.js
```
**Output:**
![Exp on my friends repo](/docs/analyzeGitRepo-exp.png)

## API Documentation

### `CodeMetrics`

Main class that provides the analysis interface.

#### Methods

**`analyzeFile(filePath, content)`**

Analyzes a single file and returns comprehensive metrics.

**Parameters:**
- `filePath` (string) - Path to the file (used for language detection)
- `content` (string) - File content as string

**Returns:** Object containing:
- `fileName` - File path
- `language` - Detected language
- `lines` - Line metrics (total, empty, code)
- `comments` - Comment analysis (total, singleLine, multiLine)
- `complexity` - Complexity score and breakdown
- `functions` - Function count and names
- `codeQuality` - Quality assessment with score

### `CodeAnalyzer`

Core analyzer class with individual analysis methods.

#### Methods

**`countLines(content)`**
- Counts total, empty, and code lines
- Returns: `{ total, empty, code }`

**`analyzeComments(content, commentPatterns)`**
- Identifies and counts comments
- Returns: `{ total, singleLine, multiLine }`

**`calculateComplexity(content, languagePatterns)`**
- Calculates cyclomatic complexity
- Returns: `{ total, breakdown: {...} }`

**`analyzeFunctions(content, functionPatterns)`**
- Identifies functions and their names
- Returns: `{ count, names: [...] }`

**`analyzeCodeQuality(content, functionPatterns)`**
- Assesses code quality and detects issues
- Returns: `{ summary, details, score }`

### `CodeParser`

Language detection and pattern provider.

#### Methods

**`detectLanguage(filePath)`**
- Detects programming language from file extension
- Returns: Language name (string)

**`parse(filePath, content)`**
- Returns language-specific patterns for analysis
- Returns: `{ language, commentPatterns, functionPatterns, complexityPatterns, content }`

## Supported Languages

| Language | Extensions | Status |
|----------|-----------|--------|
| JavaScript | .js, .jsx | ✅ Full support |
| TypeScript | .ts, .tsx | ✅ Full support |
| Python | .py | ✅ Full support |
| Java | .java | ✅ Full support |
| C++ | .cpp, .cc, .cxx | ✅ Full support |
| C | .c | ✅ Full support |
| C# | .cs | ✅ Full support |
| PHP | .php | ✅ Full support |
| Ruby | .rb | ✅ Full support |
| Go | .go | ✅ Full support |
| Rust | .rs | ✅ Full support |
| Swift | .swift | ✅ Full support |
| Kotlin | .kt | ✅ Full support |
| Scala | .scala | ✅ Full support |

## Quality Scoring

Code quality is scored from 0-100 based on detected issues:

**Score Calculation:**
- Start: 100 points
- Critical issues: -25 points each
- Errors: -10 points each  
- Warnings: -2 points each

**Score Interpretation:**
- 90-100: Excellent code quality
- 80-89: Good code quality
- 70-79: Acceptable, needs minor improvements
- 60-69: Problematic code
- 50-59: Poor code quality
- 0-49: Critical issues present

**Issue Categories:**

**Critical:**
- Unclosed brackets/parentheses
- Unclosed strings
- Many missing semicolons

**Errors:**
- Loose equality (== instead of ===)
- Unused variables
- If statements without braces
- Potential type errors

**Warnings:**
- Many console.log statements
- Long lines (>120 characters)
- Deep nesting (>5 levels)
- Low comment ratio (<10%)
- Long functions (>50 lines average)

## Testing

The module has been thoroughly tested with both single-file and repository analysis. See the complete [test report](TestReport.md)

**Run tests:**
```bash
# Single file test
node moduleTest.js

# Repository analysis test
node test/analyzeGitRepo.js
```


## Project Structure

```
code-metrics-core/
├── docs
|   └──TestReport.md
├── src/
│   ├── analyzer.js       # Core analysis methods
│   ├── parser.js         # Language detection and patterns
│   └── index.js          # Main entry point
├── test/
│   └── analyzeGitRepo.js # Repository testing
|
├── package.json
├── moduleTest.js     # Single file testing
├── TESTING.md            # Detailed test report
└── README.md
```

## Dependencies

- **Node.js:** v22.7.0 or higher
- **Git:** Required for repository analysis
- **ESLint:** (dev) Code quality checking

No runtime dependencies - pure Node.js implementation.

## Version History

### v1.0.0 (2025-01-01)
- Initial release
- Multi-language support for 14+ languages
- Single file analysis
- Repository analysis via Git clone
- Code quality assessment
- Complexity calculation with breakdown
- Function identification

## License
[MIT License](LICENSE)


## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues
- Use GitHub Issues to report bugs
- Include code samples that reproduce the issue
- Specify your Node.js version and operating system

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Run ESLint before committing: `npm run lint`
- Add tests for new features
- Update documentation as needed

### Areas for Contribution
- Additional language support
- Performance optimizations
- More code quality checks
- Automated testing framework
- Configuration file support
- Output format options (JSON, CSV, HTML)

## Future Features

- Automated unit testing with Jest
- Performance benchmarks
- Configuration file support (.codemetricsrc)
- Custom quality rules
- CI/CD integration examples
- Web-based dashboard
- VS Code extension
- CLI tool with arguments
- Export results to JSON/CSV/HTML
- Git history analysis
- Comparison between commits

## Contact & Support

- **GitHub:** [[Arian Shwan]](https://github.com/ArianShwan)
- **Issues:** [\[Project Issues Page\]](https://github.com/ArianShwan/code-metrics-core/issues)
- **Documentation:** [README.md](README.md), [TestReport](TestReport.md), [For Daniel - Reflection](Reflection.md)

For questions or support, please open an issue on GitHub.

## Acknowledgments

- Built as a learning project for code analysis
- Inspired by ESLint, SonarQube, and other code quality tools
- Thanks to the open-source community for inspiration

---

**Made with Node.js**