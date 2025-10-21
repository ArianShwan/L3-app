const express = require('express')
const path = require('path')
const { RepositoryAnalyzer } = require('code-metrics-core')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static('public'))

// Initialize analyzer
const analyzer = new RepositoryAnalyzer()

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/api/analyze', async (req, res) => {
  const { repoUrl } = req.body

  if (!repoUrl) {
    return res.status(400).json({
      success: false,
      error: 'Repository URL is required'
    })
  }

  if (!repoUrl.startsWith('http')) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid HTTPS Git URL'
    })
  }

  console.log(`\n=== New Analysis Request ===`)
  console.log(`Repository: ${repoUrl}`)
  console.log(`Time: ${new Date().toISOString()}`)

  try {
    const result = await analyzer.analyzeRepository(repoUrl)

    console.log(`✓ Analysis complete: ${result.summary.totalFiles} files analyzed`)

    res.json(result)

  } catch (error) {
    console.error(`✗ Analysis failed:`, error.message)

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`\n======================================`)
  console.log(`  Code Metrics Dashboard Server`)
  console.log(`======================================`)
  console.log(`  Server running at: http://localhost:${PORT}`)
  console.log(`======================================\n`)
})
