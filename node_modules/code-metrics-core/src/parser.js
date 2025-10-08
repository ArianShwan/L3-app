class CodeParser {
  
  // Detect programming language based on file extension
  detectLanguage(filePath) {
    const extension = filePath.split('.').pop().toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala'
    };
    
    return languageMap[extension] || 'generic';
  }

  // Specifics to detect functions in different languages
  getCommentPatterns(language) {
    const patterns = {
      javascript: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      typescript: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      python: {
        singleLine: /#.*/g,
        multiLine: /"""[\s\S]*?"""|'''[\s\S]*?'''/g
      },
      java: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      cpp: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      c: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      csharp: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      php: {
        singleLine: /\/\/.*|#.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      ruby: {
        singleLine: /#.*/g,
        multiLine: /=begin[\s\S]*?=end/g
      },
      go: {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      },
      generic: {
        singleLine: /\/\/.*|#.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      }
    };
    
    return patterns[language] || patterns.generic;
  }

    // Language-specific function patterns
    getFunctionPatterns(language) {
    const patterns = {
      javascript: [
        /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,              // Class methods
        /(?:function|async\s+function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, // function declarations
        /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g // arrow functions
      ],
      typescript: [
        /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
        /(?:function|async\s+function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g
      ],
      python: [
        /^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm,          // def function_name(
        /^\s*async\s+def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm  // async def function_name(
      ],
      java: [
        /(?:public|private|protected)?\s*(?:static)?\s*(?:\w+\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/g
      ],
      cpp: [
        /(?:\w+\s+)*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{/g
      ],
      c: [
        /(?:\w+\s+)*([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*{/g
      ],
      csharp: [
        /(?:public|private|protected|internal)?\s*(?:static)?\s*(?:\w+\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/g
      ],
      php: [
        /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
      ],
      ruby: [
        /def\s+([a-zA-Z_][a-zA-Z0-9_]*)/g
      ],
      go: [
        /func\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
      ],
      generic: [
        /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm
      ]
    };
    
    return patterns[language] || patterns.generic;
  }

  // Language-specific complexity patterns
  getComplexityPatterns(language) {
    const patterns = {
      javascript: {
        'if': /\bif\s*\(/g,
        'for': /\bfor\s*\(/g,
        'while': /\bwhile\s*\(/g,
        'switch': /\bswitch\s*\(/g,
        'case': /\bcase\s+/g,
        'catch': /\bcatch\s*\(/g,
        '&&': /&&/g,
        '||': /\|\|/g,
        '?': /\?.*:/g
      },
      python: {
        'if': /\bif\s+.*:/g,
        'elif': /\belif\s+.*:/g,
        'for': /\bfor\s+.*:/g,
        'while': /\bwhile\s+.*:/g,
        'try': /\btry\s*:/g,
        'except': /\bexcept.*:/g,
        'and': /\band\b/g,
        'or': /\bor\b/g
      },
      java: {
        'if': /\bif\s*\(/g,
        'for': /\bfor\s*\(/g,
        'while': /\bwhile\s*\(/g,
        'switch': /\bswitch\s*\(/g,
        'case': /\bcase\s+/g,
        'catch': /\bcatch\s*\(/g,
        '&&': /&&/g,
        '||': /\|\|/g,
        '?': /\?.*:/g
      },
      generic: {
        'if': /\bif\b/g,
        'for': /\bfor\b/g,
        'while': /\bwhile\b/g,
        'switch': /\bswitch\b/g,
        'case': /\bcase\b/g
      }
    };
    
    return patterns[language] || patterns.generic;
  }


    parse(filePath, content) {
    const language = this.detectLanguage(filePath);
    
    return {
      language: language,
      commentPatterns: this.getCommentPatterns(language),
      functionPatterns: this.getFunctionPatterns(language),
      complexityPatterns: this.getComplexityPatterns(language),
      content: content
    };
  }
}

module.exports = CodeParser