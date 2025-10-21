### HEADS UP!
This is a module written by me, Arian Shwan, Software developer student at Linneaeus University. Bugs may or may not occur.

# Code Metrics Dashboard

A web-based application that analyzes Git repositories and provides detailed code quality metrics, complexity analysis, and improvement suggestions. Built with Express.js and the `code-metrics-core` module.

## Features

- **Repository Analysis**: Analyze any public Git repository by providing its HTTPS URL
- **Code Metrics**: Get detailed metrics including:
  - Lines of code (total, code, comments, blank)
  - Function count and complexity
  - Code quality scores
  - File-by-file breakdown
- **Interactive UI**: Clean, responsive web interface with real-time analysis
- **Quality Indicators**: Visual quality scoring system (Good/Medium/Low)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **Git** (required for cloning repositories)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ArianShwan/L3-app.git
cd L3-app
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
node server.js
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter a Git repository URL (HTTPS format) in the input field, for example:
```
https://github.com/username/repository.git
```

4. Click "Analyze Repository" and wait for the analysis to complete

5. View the detailed metrics including:
   - Overall summary statistics
   - Quality score
   - Individual file metrics
   - Function complexity analysis

## Project Structure

```
L3-app/
├── public/              # Frontend files
│   ├── index.html      # Main HTML page
│   ├── app.js          # Client-side JavaScript
│   └── style.css       # Styling
├── docs/               # Documentation
│   ├── Vision.md       # Project vision
│   ├── Requirements.md # Requirements specification
│   └── Reflection.md   # Clean Code reflection
├── server.js           # Express server
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Code Analysis**: [code-metrics-core](https://github.com/ArianShwan/code-metrics-core) module
- **Version Control**: Git

## API Endpoints

### POST /api/analyze
Analyzes a Git repository and returns metrics.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repository.git"
}
```

**Response:**
```json
{
  "success": true,
  "results": [...],
  "summary": {
    "totalFiles": 10,
    "totalLines": 1000,
    "totalCodeLines": 750,
    "totalCommentLines": 100,
    "totalBlankLines": 150,
    "totalFunctions": 50,
    "averageComplexity": 2.5,
    "qualityScore": 85
  }
}
```

## Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 node server.js
```

## Development

This project was developed as part of the 1DV610 Software Quality course at Linnaeus University. It demonstrates:
- Clean Code principles
- Modular architecture
- Separation of concerns
- Error handling
- RESTful API design

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Arian Shwan**
- GitHub: [@ArianShwan](https://github.com/ArianShwan)

## Related Projects

- [code-metrics-core](https://github.com/ArianShwan/code-metrics-core) - The core analysis module used by this application

## Acknowledgments

- Robert C. Martin's "Clean Code" principles
- Linnaeus University - 1DV610 Software Quality course
