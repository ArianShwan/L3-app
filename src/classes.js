const { RepositoryAnalyzer } = require('code-metrics-core')

class AnalysisService {
  constructor() {
    this.analyzer = new RepositoryAnalyzer()
  }

  async analyze(repoUrl) {
    return await this.analyzer.analyzeRepository(repoUrl)
  }
}

class RequestValidator {
  validateRepositoryUrl(repoUrl) {
    if (!repoUrl) {
      return {
        valid: false,
        error: 'Repository URL is required'
      }
    }

    if (!this.isHttpUrl(repoUrl)) {
      return {
        valid: false,
        error: 'Please provide a valid HTTPS Git URL'
      }
    }

    return { valid: true }
  }

  isHttpUrl(url) {
    return url.startsWith('http')
  }
}

class AnalysisController {
  constructor(analysisService, validator) {
    this.analysisService = analysisService
    this.validator = validator
  }

  async handleAnalyzeRequest(req, res) {
    const { repoUrl } = req.body

    const validation = this.validator.validateRepositoryUrl(repoUrl)
    if (!validation.valid) {
      return this.sendValidationError(res, validation.error)
    }

    this.logRequest(repoUrl)

    try {
      const result = await this.analysisService.analyze(repoUrl)
      this.logSuccess(result)
      return res.json(result)
    } catch (error) {
      this.logError(error)
      return this.sendAnalysisError(res, error)
    }
  }

  sendValidationError(res, errorMessage) {
    return res.status(400).json({
      success: false,
      error: errorMessage
    })
  }

  sendAnalysisError(res, error) {
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }

  logRequest(repoUrl) {
    console.log(`\n=== New Analysis Request ===`)
    console.log(`Repository: ${repoUrl}`)
    console.log(`Time: ${new Date().toISOString()}`)
  }

  logSuccess(result) {
    console.log(`✓ Analysis complete: ${result.summary.totalFiles} files analyzed`)
  }

  logError(error) {
    console.error(`✗ Analysis failed:`, error.message)
  }
}

module.exports = {
  AnalysisService,
  RequestValidator,
  AnalysisController
}
