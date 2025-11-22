const LineAnalyzer = require('./analyzers/LineAnalyzer')
const CommentAnalyzer = require('./analyzers/CommentAnalyzer')
const ComplexityAnalyzer = require('./analyzers/ComplexityAnalyzer')
const FunctionAnalyzer = require('./analyzers/FunctionAnalyzer')
const QualityAnalyzer = require('./analyzers/QualityAnalyzer')

class CodeAnalyzer {
  constructor() {
    this.lineAnalyzer = new LineAnalyzer()
    this.commentAnalyzer = new CommentAnalyzer()
    this.complexityAnalyzer = new ComplexityAnalyzer()
    this.functionAnalyzer = new FunctionAnalyzer()
    this.qualityAnalyzer = new QualityAnalyzer()
  }

  countLines(content) {
    return this.lineAnalyzer.countLines(content)
  }

  analyzeComments(content, commentPatterns) {
    return this.commentAnalyzer.analyzeComments(content, commentPatterns)
  }

  calculateComplexity(content, languagePatterns) {
    return this.complexityAnalyzer.calculateComplexity(content, languagePatterns)
  }

  analyzeFunctions(content, functionPatterns) {
    return this.functionAnalyzer.analyzeFunctions(content, functionPatterns)
  }

  analyzeCodeQuality(content, functionPatterns) {
    return this.qualityAnalyzer.analyzeCodeQuality(content, functionPatterns)
  }
}

module.exports = CodeAnalyzer
