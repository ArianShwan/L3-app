document.addEventListener('DOMContentLoaded', () => {
  
  const gitUrlInput = document.getElementById('gitUrlInput')
  const analyzeBtn = document.getElementById('analyzeBtn')
  const loading = document.getElementById('loading')
  const resultsDiv = document.getElementById('results')

  analyzeBtn.addEventListener('click', async () => {
    const gitUrl = gitUrlInput.value.trim()

    if (!gitUrl) {
      alert('Please enter a Git repository URL')
      return
    }

    if (!gitUrl.startsWith('http')) {
      alert('Please enter a valid HTTPS Git URL (e.g., https://github.com/username/repo.git)')
      return
    }

    loading.style.display = 'block'
    resultsDiv.innerHTML = ''
    analyzeBtn.disabled = true

    try {
      // Send request to backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ repoUrl: gitUrl })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository')
      }

      displayResults(data)

    } catch (error) {
      resultsDiv.innerHTML = `
        <div class="error">
          <h3>Error</h3>
          <p>${error.message}</p>
        </div>
      `
    } finally {
      loading.style.display = 'none'
      analyzeBtn.disabled = false
    }
  })

  function displayResults(data) {
    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = '<p>No files were analyzed.</p>'
      return
    }

    const summary = data.summary
    const results = data.results

    let html = `
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

      <div class="detailed-results">
        <h2>Detailed File Analysis</h2>
        ${results.map((result, index) => `
          <div class="file-result">
            <h3>${index + 1}. ${result.fileName}</h3>
            <div class="file-stats">
              <p><strong>Language:</strong> ${result.language}</p>
              <p><strong>Lines:</strong> ${result.lines.total} total (${result.lines.code} code, ${result.lines.empty} empty)</p>
              <p><strong>Comments:</strong> ${result.comments.total} (${result.comments.singleLine} single, ${result.comments.multiLine} multi)</p>
              <p><strong>Functions:</strong> ${result.functions.count} - [${result.functions.names.join(', ')}]</p>
              <p><strong>Complexity:</strong> ${result.complexity.total}</p>
              <p><strong>Quality Score:</strong> <span class="quality-score ${getQualityClass(result.codeQuality.score)}">${result.codeQuality.score}/100</span></p>
              <p><strong>Issues:</strong> ${result.codeQuality.summary.critical} critical, ${result.codeQuality.summary.errors} errors, ${result.codeQuality.summary.warnings} warnings</p>
            </div>
          </div>
        `).join('')}
      </div>
    `

    resultsDiv.innerHTML = html
  }

  function getQualityClass(score) {
    if (score >= 80) return 'quality-good'
    if (score >= 60) return 'quality-medium'
    return 'quality-low'
  }
})
