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