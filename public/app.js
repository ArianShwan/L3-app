document.addEventListener('DOMContentLoaded', () => {
  const gitUrlInput = document.getElementById('gitUrlInput')
  const analyzeBtn = document.getElementById('analyzeBtn')
  const loading = document.getElementById('loading')
  const resultsDiv = document.getElementById('results')

  const apiService = new ApiService()
  const uiManager = new UIManager(loading, analyzeBtn, resultsDiv)
  const appController = new AppController(apiService, uiManager)

  analyzeBtn.addEventListener('click', () => {
    appController.handleAnalyzeClick(gitUrlInput.value)
  })
})
