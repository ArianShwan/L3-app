class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  async analyzeRepository(repoUrl) {
    const validation = this.validateUrl(repoUrl)
    if (!validation.isValid) {
      throw new Error(validation.errorMessage)
    }

    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repoUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to analyze repository')
    }

    return data
  }

  validateUrl(url) {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      return {
        isValid: false,
        errorMessage: 'Please enter a Git repository URL'
      }
    }

    if (!trimmedUrl.startsWith('http')) {
      return {
        isValid: false,
        errorMessage: 'Please enter a valid HTTPS Git URL (e.g., https://github.com/username/repo.git)'
      }
    }

    return { isValid: true }
  }
}
