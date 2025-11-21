class AppController {
  constructor(apiService, uiManager) {
    this.apiService = apiService
    this.uiManager = uiManager
  }

  async handleAnalyzeClick(gitUrl) {
    this.uiManager.showLoading()

    try {
      const data = await this.apiService.analyzeRepository(gitUrl)
      this.uiManager.renderResults(data)
    } catch (error) {
      this.uiManager.renderError(error.message)
    } finally {
      this.uiManager.hideLoading()
    }
  }
}
