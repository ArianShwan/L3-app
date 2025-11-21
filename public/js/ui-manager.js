class UIManager {
  constructor(loadingElement, analyzeButton, resultsContainer) {
    this.loadingElement = loadingElement
    this.analyzeButton = analyzeButton
    this.resultsContainer = resultsContainer
  }

  showLoading() {
    this.loadingElement.style.display = 'block'
    this.analyzeButton.disabled = true
    this.clearResults()
  }

  hideLoading() {
    this.loadingElement.style.display = 'none'
    this.analyzeButton.disabled = false
  }

  clearResults() {
    this.resultsContainer.innerHTML = ''
  }

  renderResults(data) {
    if (!this.hasResults(data)) {
      this.renderNoResults()
      return
    }

    const html = this.buildResultsHtml(data)
    this.resultsContainer.innerHTML = html
  }

  renderError(errorMessage) {
    this.resultsContainer.innerHTML = `
      <div class="error">
        <h3>Error</h3>
        <p>${errorMessage}</p>
      </div>
    `
  }

  hasResults(data) {
    return data.results && data.results.length > 0
  }

  renderNoResults() {
    this.resultsContainer.innerHTML = '<p>No files were analyzed.</p>'
  }

  buildResultsHtml(data) {
    const summaryHtml = this.buildSummarySection(data.summary)
    const detailsHtml = this.buildDetailedResults(data.results)
    return summaryHtml + detailsHtml
  }

  buildSummarySection(summary) {
    return `
      <div class="summary-section">
        <h2>Repository Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Total Files:</span>
            <span class="summary-value">${summary.totalFiles}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Lines:</span>
            <span class="summary-value">${summary.totalLines}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Code Lines:</span>
            <span class="summary-value">${summary.totalCodeLines}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Total Functions:</span>
            <span class="summary-value">${summary.totalFunctions}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Avg Complexity:</span>
            <span class="summary-value">${summary.avgComplexity}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Avg Quality Score:</span>
            <span class="summary-value">${summary.avgQualityScore}/100</span>
          </div>
        </div>
        <div class="language-distribution">
          <h3>Language Distribution</h3>
          ${Object.entries(summary.languageDistribution)
            .map(([lang, count]) => `
              <div class="lang-item">
                <span>${lang}:</span> <strong>${count} files</strong>
              </div>
            `).join('')}
        </div>
      </div>
    `
  }

  buildDetailedResults(results) {
    const fileResults = results.map((result, index) => `
      <div class="file-result">
        <h3>${index + 1}. ${result.fileName}</h3>
        <div class="file-stats">
          <p><strong>Language:</strong> ${result.language}</p>
          <p><strong>Lines:</strong> ${result.lines.total} total (${result.lines.code} code, ${result.lines.empty} empty)</p>
          <p><strong>Comments:</strong> ${result.comments.total} (${result.comments.singleLine} single, ${result.comments.multiLine} multi)</p>
          <p><strong>Functions:</strong> ${result.functions.count} - [${result.functions.names.join(', ')}]</p>
          <p><strong>Complexity:</strong> ${result.complexity.total}</p>
          <p><strong>Quality Score:</strong> <span class="quality-score ${this.getQualityClass(result.codeQuality.score)}">${result.codeQuality.score}/100</span></p>
          <p><strong>Issues:</strong> ${result.codeQuality.summary.critical} critical, ${result.codeQuality.summary.errors} errors, ${result.codeQuality.summary.warnings} warnings</p>
        </div>
      </div>
    `).join('')

    return `
      <div class="detailed-results">
        <h2>Detailed File Analysis</h2>
        ${fileResults}
      </div>
    `
  }

  getQualityClass(score) {
    if (score >= 80) return 'quality-good'
    if (score >= 60) return 'quality-medium'
    return 'quality-low'
  }
}
