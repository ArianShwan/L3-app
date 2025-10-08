class CodeAnalyzer {

  countLines(content) {
    const lines = content.split('\n')
    const totalLines = lines.length
    const emptyLines = lines.filter(line => line.trim() === '').length
    const codeLines = totalLines - emptyLines

    return {
      total: totalLines,
      empty: emptyLines,
      code: codeLines,
    };
  }

  analyzeComments(content, commentPatterns) {
    if(!commentPatterns){
      commentPatterns = {
        singleLine: /\/\/.*/g,
        multiLine: /\/\*[\s\S]*?\*\//g
      };
    }

    const singleLineComments = content.match(commentPatterns.singleLine) || []
    const multiLineComments = content.match(commentPatterns.multiLine) || []

    return {
      total: singleLineComments.length + multiLineComments.length,
      singleLine: singleLineComments.length,
      multiLine: multiLineComments.length
    };
  }

  calculateComplexity(content, languagePatterns) {
    let codeOnly = content
      .replace(/\/\/.*$/gm, '') // Single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
      .replace(/^\s*[\r\n]/gm, '') // Empty lines

    const complexityPatterns = languagePatterns || {
      'if': /\bif\b/g,
      'for': /\bfor\b/g,
      'while': /\bwhile\b/g,
      'switch': /\bswitch\b/g,
      'case': /\bcase\b/g,
      'catch': /\bcatch\b/g,
      'else if': /\belse if\b/g,
      'else': /\belse\b/g,
      '&&': /&&/g,
      '||': /\|\|/g,
      '?': /\?/g
    }

    const breakdown = {}
    let totalComplexity = 0

    // Calculate complexity based on patterns
    Object.entries(complexityPatterns).forEach(([name, pattern]) => {
      const matches = codeOnly.match(pattern) || []
      const count = matches.length

      if (count > 0) {
        breakdown[name] = count
        totalComplexity += count
      }
    })

    return {
      total: totalComplexity,
      breakdown: breakdown
    }
  }

  analyzeFunctions(content, functionPatterns) {
  if (!functionPatterns) {
    functionPatterns = [
      /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
      /(?:function|async\s+function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
    ];
  }
  
  // Remove comments and strings to avoid false positives
  const codeOnly = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');
  
  const functionNames = [];
  
  functionPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(codeOnly)) !== null) {
      if (match[1]) {  // Control to ensure there's a captured group
        const functionName = match[1];
        const keywords = ['if', 'while', 'for', 'switch', 'catch', 'return', 'filter', 'match'];
        if (!keywords.includes(functionName)) {
          functionNames.push(functionName);
        }
      }
    }
  });

  return {
    count: functionNames.length,
    names: [...new Set(functionNames)]
  };
}

  analyzeCodeQuality(content, functionPatterns) {
    const errors = [];
    const warnings = [];
    const critical = [];

    // Erase strings and comments to avoid false positives
    const codeOnly = content
      .replace(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`/g, '""')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '');

    // CRITICAL (code that will definitely cause bugs)
    this.checkBalancedBrackets(codeOnly, critical);
    this.checkMissingSemicolons(codeOnly, critical);
    this.checkUnclosedStrings(content, critical);

    // WRONG (code that is likely to cause bugs)
    this.checkLooseEquality(codeOnly, errors);
    this.checkUnusedVariables(codeOnly, errors);
    this.checkMissingControlStructures(codeOnly, errors);
    this.checkPotentialTypeErrors(codeOnly, errors);

    // WARNINGS (code that is not best practice)
    this.checkConsoleStatements(codeOnly, warnings);
    this.checkLongLines(content, warnings);
    this.checkDeepNesting(codeOnly, warnings);
    this.checkCommentRatio(content, warnings);
    this.checkFunctionLength(content, functionPatterns, warnings);

    return {
      summary: {
        critical: critical.length,
        errors: errors.length,
        warnings: warnings.length,
        total: critical.length + errors.length + warnings.length
      },
      details: {
        critical: critical,
        errors: errors,
        warnings: warnings
      },
      score: this.calculateQualityScore(critical, errors, warnings)
    };
  }

  // Help methods for analyzeCodeQuality
  checkBalancedBrackets(code, issues) {
    const brackets = { '(': 0, '[': 0, '{': 0 };
    const closers = { ')': '(', ']': '[', '}': '{' };

    // Track opening and closing brackets
    for (let char of code) {
      if (Object.prototype.hasOwnProperty.call(brackets, char)) {
        brackets[char]++;
      } else if (Object.prototype.hasOwnProperty.call(closers, char)) {
        const opener = closers[char];
        brackets[opener]--;
        if (brackets[opener] < 0) {
          issues.push(`Unmatched closing '${char}'`);
          brackets[opener] = 0;
        }
      }
    }

    // Check for any unclosed brackets
    Object.entries(brackets).forEach(([bracket, count]) => {
      if (count > 0) {
        issues.push(`${count} unclosed '${bracket}' bracket(s)`);
      }
    });
  }

  checkMissingSemicolons(code, issues) {
    const lines = code.split('\n');
    let missingSemicolons = 0;
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed &&
          !trimmed.endsWith(';') &&
          !trimmed.endsWith('{') &&
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.match(/^(if|else|for|while|switch|function|class)/)) {
        missingSemicolons++;
      }
    });

    if (missingSemicolons > 5) {
      issues.push(`${missingSemicolons} statements missing semicolons`);
    }
  }

  checkUnclosedStrings(content, issues) {
    const stringMatches = content.match(/["'`]/g) || [];
    if (stringMatches.length % 2 !== 0) {
      issues.push('Possible unclosed string literal');
    }
  }

  checkLooseEquality(code, issues) {
    const looseEquality = (code.match(/[^!=]==|!=/g) || []).length;
    if (looseEquality > 0) {
      issues.push(`${looseEquality} instances of loose equality (== or !=) - use === or !==`);
    }
  }

  checkUnusedVariables(code, issues) {
    const declarations = code.match(/(?:var|let|const)\s+(\w+)/g) || [];
    const variableNames = declarations.map(decl => decl.split(/\s+/)[1]);
    
    variableNames.forEach(varName => {
      const usage = new RegExp(`\\b${varName}\\b`, 'g');
      const usageCount = (code.match(usage) || []).length;
      if (usageCount <= 1) { // Only declared, never used
        issues.push(`Variable '${varName}' appears to be unused`);
      }
    });
  }

  checkMissingControlStructures(code, issues) {
    const ifWithoutBraces = (code.match(/if\s*\([^)]+\)\s*[^{]/g) || []).length;
    if (ifWithoutBraces > 0) {
      issues.push(`${ifWithoutBraces} if statements without braces`);
    }
  }

  checkPotentialTypeErrors(code, issues) {
    const nullComparisons = (code.match(/==\s*null|null\s*==/g) || []).length;
    if (nullComparisons > 0) {
      issues.push(`${nullComparisons} potential null comparison issues`);
    }
  }

  checkConsoleStatements(code, issues) {
    const consoleCount = (code.match(/console\.(log|warn|error|info)/g) || []).length;
    if (consoleCount > 5) {
      issues.push(`${consoleCount} console statements found - consider removing for production`);
    }
  }

  checkLongLines(content, issues) {
    const lines = content.split('\n');
    const longLines = lines.filter(line => line.length > 120).length;
    if (longLines > 0) {
      issues.push(`${longLines} lines exceed 120 characters`);
    }
  }

  checkDeepNesting(code, issues) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (let char of code) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    if (maxDepth > 5) {
      issues.push(`Deep nesting detected (${maxDepth} levels) - consider refactoring`);
    }
  }

  checkCommentRatio(content, issues) {
    const lines = this.countLines(content);
    const comments = this.analyzeComments(content);
    const ratio = comments.total / lines.total;
    
    if (ratio < 0.1) {
      issues.push(`Low comment ratio (${Math.round(ratio * 100)}%) - consider adding more documentation`);
    }
  }

  checkFunctionLength(content, functionPatterns, issues) {
    const functions = this.analyzeFunctions(content, functionPatterns); // Use the provided function patterns
    const lines = this.countLines(content);  // Simple heuristic: if we have many functions and high line count, functions might be too long
    if (functions.count > 0 && (lines.code / functions.count) > 50) {
      issues.push('Functions may be too long - consider breaking them down');
    }
  }

  calculateQualityScore(critical, errors, warnings) {
    let score = 100;
    score -= critical.length * 25; // Critical issues are very bad
    score -= errors.length * 10;   // Errors are bad
    score -= warnings.length * 2;  // Warnings are minor
    
    return Math.max(0, score);
  }

}

module.exports = CodeAnalyzer
