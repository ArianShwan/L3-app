# Reflektion över Clean Code i mitt projekt

Den här reflektionen handlar om hur Robert C. Martins bok "Clean Code" har påverkat min kod i både `code-metrics-core`-modulen (Labb 2) och `L3-app`. Jag ska vara ärlig om både det jag lyckats med och det jag kunde gjort bättre.

---

## Kapitel 2: Meaningful Names

Jag har faktiskt försökt tänka på namnen i min kod, och tycker att det mesta är ganska självförklarande. Funktioner som `analyzeRepository`, `countLines` och `generateSummary` säger ju precis vad de gör utan att man behöver läsa koden, vilket Martin kallar "Use Intention Revealing Names". Men jag har också upptäckt att jag använder ganska generiska namn ibland, `data` i app.js är ett klassiskt exempel där jag borde använt något mer specifikt som `analysisResult`. I analyzer.js kallar jag en variabel för `codeOnly` när jag egentligen menar "kod utan kommentarer", så där kunde jag vart tydligare.

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bra exempel på tydliga namn
async analyzeRepository(repoUrl, options = {}) {
  const verbose = options.verbose || false
  const tempDir = options.tempDir || './temp-repo-' + Date.now()
```

```javascript
// L3-app/app.js - Här kunde jag vart bättre
const data = await response.json()  // "data" säger ingenting - borde vara "analysisResult"
```

---

## Kapitel 3: Functions

Det här kapitlet har definitivt påverkat hur jag tänker, men jag måste erkänna att jag inte alltid följt principerna. Min `getQualityClass` funktion är typ perfekt enligt "Small!", den är kort, gör EN sak och är lätt att förstå. Men sedan har jag `scanDirectory` som är typ 50 rader och gör allt möjligt: läser filer, filtrerar dem, analyserar innehållet OCH samlar resultat. Det är precis vad Martin varnar för när han säger "Do One Thing" funktionen gör flera saker på olika abstraktionsnivåer. Jag borde ha delat upp den i typ `shouldSkipFile()`, `analyzeFile()` och `collectResults()`. Det är lite pinsamt när man läser sin egen kod med Clean Code glasögonen på!

```javascript
// L3-app/app.js - Perfekt enligt "Small!"
function getQualityClass(score) {
  if (score >= 80) return 'quality-good'
  if (score >= 60) return 'quality-medium'
  return 'quality-low'
}
```

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bryter mot "Small!" och "Do One Thing"
scanDirectory(dir, verbose = false) {
  const results = []
  const scan = (currentDir) => {
    const files = fs.readdirSync(currentDir)
    files.forEach(file => {
      // 40+ rader kod... läser filer, analyserar, filtrerar, validerar...
      // Gör för många saker på en gång!
    })
  }
  scan(dir)
  return results
}
```

---

## Kapitel 4: Comments

När jag läser kapitlet om kommentarer känner jag mig faktiskt rätt nöjd med hur jag använt JSDoc för mina publika funktioner, det är ju "Good Comments" enligt Martin eftersom de dokumenterar API:et. Men sedan ser jag kommentarer som `// Clone the repository` före `execSync('git clone')` och inser att det är helt onödigt, koden säger ju exakt samma sak! Det Martin kallar "Redundant Comments". Det roliga är att i analyzer.js har jag kommentarer för att förklara regex (`// Single-line comments`), vilket egentligen också är onödigt MEN där hade jag kunnat göra något smartare: extrahera regex till konstanter med beskrivande namn istället. Typ `const SINGLE_LINE_COMMENT_PATTERN = /\/\/.*$/gm`  då hade jag inte behövt kommentaren alls. Men jag skyller på regex koplexa och konstiga mönster patterns för att finna vissa saker.

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bra JSDoc som faktiskt behövs
/**
 * Analyzes a Git repository from a given URL
 * @param {string} repoUrl - The HTTPS Git repository URL
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} Analysis results
 */
async analyzeRepository(repoUrl, options = {})
```

```javascript
// code-metrics-core/analyzer.js - Kommentarer som hade kunnat ersättas med bättre kod
let codeOnly = content
  .replace(/\/\/.*$/gm, '')        // Single-line comments
  .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments

// Bättre så här:
const SINGLE_LINE_COMMENT_PATTERN = /\/\/.*$/gm
const MULTI_LINE_COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g
let codeWithoutComments = content
  .replace(SINGLE_LINE_COMMENT_PATTERN, '')
  .replace(MULTI_LINE_COMMENT_PATTERN, '')
```

---

## Kapitel 5: Formatting

Formatering är något jag faktiskt tänkt på från början,  jag använder konsekventa 2-space indents överallt och grupperar relaterade variabler tillsammans. I `generateSummary` har jag alla `total` variabler grupperade vilket Martin kallar "Vertical Openness Between Concepts", det gör det lättare att se vad som hör ihop. Men när jag tittar på app.js ser jag att jag glömt lägga in blank lines mellan variabeldeklarationer och själva logiken, vilket gör att koden känns lite trång att läsa. Det är småsaker men det påverkar ju faktiskt läsbarheten mer än man tror.

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bra gruppering av relaterade variabler
const totalLines = results.reduce((sum, r) => sum + r.lines.total, 0)
const totalCodeLines = results.reduce((sum, r) => sum + r.lines.code, 0)
const totalFunctions = results.reduce((sum, r) => sum + r.functions.count, 0)
```

```javascript
// L3-app/app.js - Skulle behöva mer "luft"
const gitUrlInput = document.getElementById('gitUrlInput')
const analyzeBtn = document.getElementById('analyzeBtn')
const loading = document.getElementById('loading')
const resultsDiv = document.getElementById('results')
analyzeBtn.addEventListener('click', async () => {  // ⬅ Behöver blank line här
```

---

## Kapitel 6: Objects and Data Structures

Det här kapitlet fick mig att tänka på hur jag strukturerar mina klasser. I `RepositoryAnalyzer` använder jag komposition istället för arv, jag injicerar `CodeAnalyzer` och `CodeParser` i konstruktorn vilket gör klasserna mer flexibla. Det känns rätt bra! Men i L3-app insåg jag att jag brutit mot "Law of Demeter" genom att röra vid DOM-element direkt (`loading.style.display = 'block'`) överallt i koden. Det hade varit mycket snyggare med en UI-klass som kapslar in alla DOM-operationer. Nu är det lite rörigt och svårt att testa eftersom allt är hårt kopplat till DOM:en.

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bra komposition
class RepositoryAnalyzer {
  constructor() {
    this.codeAnalyzer = new CodeAnalyzer()  // Komposition över arv
    this.parser = new CodeParser()
    this.supportedExts = [...]              // Inkapsling
  }
}
```

```javascript
// L3-app/app.js - Bryter mot Law of Demeter
loading.style.display = 'block'     // Rör vid interna detaljer
resultsDiv.innerHTML = ''           // Direkt DOM-manipulation överallt
analyzeBtn.disabled = true

// Hade varit bättre med:
// ui.showLoading()
// ui.clearResults()
// ui.disableButton()
```

---

## Kapitel 7: Error Handling

Error handling är något jag faktiskt tycker att jag gjort ganska bra! I `analyzeRepository` använder jag try-catch med cleanup i catch-blocket så att temporära filer alltid tas bort, även om något går fel. Martin kallar detta "Define Exception Flow" och det känns proffsigt. Men sedan upptäckte jag en ful grej i samma fil, när jag läser enskilda filer och något går fel så "swallows" jag exception om `verbose` är false. Det betyder att fel kan försvinna helt tyst vilket gör debugging nästan omöjligt. Det är exakt vad Martin varnar för när han säger "Don't Ignore Caught Exceptions". Borde alltid logga felet, och kanske bara visa stack trace när verbose är true.

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Bra error handling med cleanup
try {
  execSync(`git clone ${repoUrl} ${tempDir}`)
  const results = this.scanDirectory(tempDir, verbose)
  return { success: true, results, summary }
} catch (error) {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })  // Cleanup!
  }
  throw new Error(`Failed to analyze repository: ${error.message}`)
}
```

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Dåligt! Swallows exceptions
try {
  const content = fs.readFileSync(fullPath, 'utf8')
  // ...analys
} catch (error) {
  if (verbose) console.error(` Failed: ${error.message}`)
  // Om verbose är false försvinner felet helt! =(
}
```

---

## Kapitel 8: Boundaries

Det här kapitlet handlar mycket om hur man hanterar externa beroenden, och där tycker jag att jag lyckats ganska bra med modulstrukturen. L3-app använder `code-metrics-core` som en svart låda via ett väldefinierat API, precis som Martin beskriver "Using Third-Party Code". Om jag ändrar något internt i modulen påverkas inte appen så länge API:et är detsamma. Men sen har jag ett direkt beroende på Git CLI genom `execSync('git clone')` vilket är lite problematiskt, om git inte är installerat kraschar hela programmet. Enligt Martin borde jag ha wrappat Git-funktionaliteten i en egen klass med proper error handling. Det hade också gjort koden mycket lättare att mocka i tester.

```javascript
// L3-app/server.js - Bra boundary via modul
const { RepositoryAnalyzer } = require('code-metrics-core')
const analyzer = new RepositoryAnalyzer()
// Modulen är en "svart låda" - vet inte hur den funkar internt
```

```javascript
// code-metrics-core/RepositoryAnalyzer.js - Problematiskt direkt beroende
execSync(`git clone ${repoUrl} ${tempDir}`)  // Vad händer om Git inte finns?

// Bättre med wrapper:
class GitClient {
  clone(url, dir) {
    if (!this.isGitAvailable()) {
      throw new Error('Git is not installed')
    }
    return execSync(`git clone ${url} ${dir}`)
  }
  isGitAvailable() { /* check */ }
}
```

---

## Kapitel 9: Unit Tests

Ok, det här kapitlet gör mig lite generad... jag har inga riktiga unit tests alls. Typ noll. Jag har ett testskript som kör en faktisk Git-analys och printar resultat, men det är ju inte ett unit test med assertions och allt. Det bryter totalt mot "The Three Laws of TDD" som Martin pratar om. Min kod är också svår att testa för jag har inte tänkt på testbarhet när jag skrev den, funktionerna har massa bieffekter (läser filer, klonar repos) och hårdkodade dependencies. Om jag hade injicerat dependencies som filesystem och Git-client hade jag kunnat mocka dem och skriva proper unit tests. Det här är nog det största misstaget i hela projektet enligt Clean Code-standard.

```javascript
// examples/testRepositoryAnalyzer.js - Detta är INTE ett unit test
const results = await analyzer.analyzeRepository(
  'https://github.com/ArianShwan/code-metrics-core.git',
  { verbose: true }
)
console.log(`Total files: ${results.summary.totalFiles}`)  // Ingen assertion!
// Testar faktiskt mot internet och riktiga filer...
```

```javascript
// Problemet: Svår att testa pga hårdkodade dependencies
scanDirectory(dir, verbose = false) {
  const files = fs.readdirSync(dir)  // Hårdkodat! Kan inte mockas

// Bättre (testbart):
scanDirectory(dir, fileSystem = fs, verbose = false) {
  const files = fileSystem.readdirSync(dir)

// I test kan jag då:
const mockFS = { readdirSync: () => ['testfile.js'] }
scanDirectory('/fake/path', mockFS)
```

---

## Kapitel 10: Classes

När jag tänker på mina klasser känns det faktiskt rätt bra, `CodeAnalyzer` gör bara kod-analys, `CodeParser` parsar bara filtyper, och `RepositoryAnalyzer` koordinerar dem. Det är ganska bra "Single Responsibility Principle" tycker jag. Jag använder också komposition istället för arv genom att injicera dependencies i konstruktorn, vilket Martin förespråkar. Men så tittar jag på L3-app och inser att jag inte har EN ENDA klass där! Allt är bara loose functions i global scope vilket gör koden svår att organisera och återanvända. En `RepositoryAnalysisUI` klass som kapslar in all UI-logik hade gjort koden mycket renare och lättare att testa. Det känns lite halvgjort när modulen är så välstrukturerad men appen bara är ett gäng funktioner.

```javascript
// code-metrics-core - Bra SRP, varje klass gör EN sak
class CodeAnalyzer {
  countLines(content) { }
  analyzeComments(content, patterns) { }
  calculateComplexity(content, patterns) { }
  // Alla metoder handlar om kod-analys
}

class RepositoryAnalyzer {
  constructor() {
    this.codeAnalyzer = new CodeAnalyzer()  // Komposition!
    this.parser = new CodeParser()
  }
}
```

```javascript
// L3-app/app.js - Inga klasser alls =(
const gitUrlInput = document.getElementById('gitUrlInput')
const analyzeBtn = document.getElementById('analyzeBtn')
// Bara loose variables och functions...

// Hade varit bättre med:
class RepositoryAnalysisUI {
  constructor(elements) { this.elements = elements }
  async analyze(url) { }
  showLoading() { }
  displayResults(data) { }
}
```

---

## Kapitel 11: Systems

Det här kapitlet handlar om den större bilden och systemarkitektur. Jag tycker faktiskt att jag lyckats ganska bra här med att separera L3-app (presentation), code-metrics-core (business logic) och Node.js/Git (infrastructure) i olika lager. Det möjliggör att jag kan utveckla och testa varje del oberoende, vilket känns proffsigt. I server.js använder jag Express middleware-pattern vilket också är nice. Men sen insåg jag att frontend och backend är rätt hårt kopplade, om modulen ändrar sin JSON-struktur går frontend sönder direkt. Ett adapter-lager hade gjort systemet mer resilient. Det är inte jätteillt men det hade varit snyggare enligt "Separation of Concerns" principen.

```javascript
// Bra systemarkitektur med tydliga lager
L3-app (Presentation)      ↕
                            HTTP API
code-metrics-core (Logic)  ↕
                            Function calls
Node.js/Git (Infra)

// server.js - Bra middleware pattern
app.use(express.json())        // Middleware
app.use(express.static('public'))
app.post('/api/analyze', ...)  // Routes
```

```javascript
// L3-app/app.js - Tight coupling till backend format
const summary = data.summary  // Förväntar sig EXAKT denna struktur
const results = data.results   // Om backend ändrar sig → KRASCH

// Bättre med adapter:
class APIAdapter {
  adaptResponse(rawData) {
    return {
      summary: rawData.summary || this.getDefaultSummary(),
      results: rawData.results || []
    }
  }
}
```

---

## Slutreflektion

Att läsa Clean Code och sedan titta på sin egen kod är lite som att sätta på sig glasögon för första gången, lite såsom det var i Workshop 2 när vi delades upp i par och vi ksulle läsa varandras moduler samt kolla igenom våra egna. Plötsligt ser man alla småfel man missat tidigare. Jag är stolt över vissa delar, särskilt modulstrukturen och namngivningen, men inser också att jag har mycket att lära när det gäller funktionsstorlek, testbarhet och klassdesign i frontend-kod.

Det största takeaway:et för mig är att "clean code" inte handlar om att skriva perfekt kod från början, utan om att kontinuerligt förbättra och refaktorera. Som Martin säger: "The only way to go fast is to go well." Om jag hade haft unit tests och mindre funktioner från början hade det varit mycket lättare att utveckla och debugga. Nu känns det som att koden funkar men är lite såsom den är, en classic "it works on my machine"-situation.

Nästa projekt ska jag definitivt tänka på testbarhet från dag ett och våga dela upp funktioner mer som du nämnde för Labb 2. Och kanske skriva ner "Does this function do ONE thing?" på en post-it på skärmen hehe.
