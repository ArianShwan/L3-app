const CodeAnalyzer = require ('./analyzer')
const CodeParser = require ('./parser')

class CodeMetrics {
  constructor() {
    this.analyzer = new CodeAnalyzer()
    this.parser = new CodeParser()
  }

  analyzeFile(filePath, content) {
    const parsed = this.parser.parse(filePath, content)

    return {
      fileName: filePath,
      language: parsed.language,
      lines: this.analyzer.countLines(content),
      comments: this.analyzer.analyzeComments(content, parsed.commentPatterns),
      complexity: this.analyzer.calculateComplexity(content, parsed.complexityPatterns),
      functions: this.analyzer.analyzeFunctions(content, parsed.functionPatterns),
      codeQuality: this.analyzer.analyzeCodeQuality(content, parsed.functionPatterns)
    }
  }
}

module.exports = CodeMetrics