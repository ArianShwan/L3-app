const express = require('express')
const cors = require('cors')
const path = require('path')
const { AnalysisService, RequestValidator, AnalysisController } = require('./classes')

class Server {
  constructor(port) {
    this.port = port
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  setupMiddleware() {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  setupRoutes() {
    const analysisService = new AnalysisService()
    const validator = new RequestValidator()
    const controller = new AnalysisController(analysisService, validator)

    this.app.get('/', this.handleHomeRequest.bind(this))

    this.app.post('/api/analyze', (req, res) => {
      controller.handleAnalyzeRequest(req, res)
    })
  }

  handleHomeRequest(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
  }

  start() {
    this.app.listen(this.port, () => {
      this.logServerStart()
    })
  }

  logServerStart() {
    console.log(`\n======================================`)
    console.log(`  Code Metrics Dashboard Server`)
    console.log(`======================================`)
    console.log(`  Server running at: http://localhost:${this.port}`)
    console.log(`======================================\n`)
  }
}

module.exports = Server
