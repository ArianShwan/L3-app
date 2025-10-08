# Clean Code Reflection - Code Metrics Core

## Namngivning (Kapitel 2)

### Tabellreflektion för namngivning

| Namn | Förklaring | Reflektion och regler från Clean Code |
|------|------------|----------------------------------------|
| `CodeMetrics` | Klassnamn på huvudklassen | **Use Intention-Revealing Names**: Tydligt vad klassen gör. **Problem**: Kunde vara mer specifik - "CodeAnalyzer" skulle beskriva funktionaliteten bättre. |
| `analyzeFile` | Metod som analyserar en fil | **Method Names**: Följer verb-regeln. **Problem**: Namnet antyder singulär fil men det framgår inte om metoden kan hantera flera filer. `analyze` skulle räcka eftersom klassen heter CodeMetrics. |
| `codeOnly` | Variabel för kod utan kommentarer | **Avoid Disinformation**: Något missvisande - "only" är vagt. `contentWithoutComments` vore tydligare. **Pick One Word per Concept**: Inkonsekvent - använder både `codeOnly` och `content` för liknande saker. |
| `breakdown` | Objekt med komplexitetsdetaljer | **Add Meaningful Context**: Saknar kontext - breakdown av vad? `complexityBreakdown` skulle vara mycket tydligare. |
| `ext` | Variabel för file extension | **Use Pronounceable Names**: Förkortning som sparar tid men offrar klarhet. `extension` vore bättre om man skulle utgå från enligt Clean Code. |

### Kapitelreflektion kap 2
Trotts att man har läst boken så är det lätt att komma bort från det man har läst när man är inne med kodandet. Det kan kanske ibland märkas av. Gånger jag använder mig av tydliga namn till functioner eller metoder såsom ananlyzeFunction, analyzeComment elelr calculateComplexity är ganska självförklarande. Medans ibland tappar man bort sig och döper vissa verbaler lite dumt såsom jag nämnde i tabellen, breakdown, result och content. Visst det kan kanske vara självklara för mig, men inte för alla.

Det var intressant med att kapitlet även nämner att en del kan vara rädda att byta namn. Vilket jag kan försstå mig på nu härdan efter, varför ändra när det funkar, men motargumentet kan då alltid vara att.. Code Review.

**Martin's viktigaste poäng**: "The name should answer why it exists, what it does, and how it is used."

---

## Funktioner (Kapitel 3)

### Tabellreflektion för funktioner/metoder

| Metodnamn | Rader | Reflektion |
|-----------|-------|------------|
| `analyzeCodeQuality` | ~25 | **Do one thing**: Gör för mycket - anropar 11 check-metoder, aggregerar resultat, beräknar score. Borde delas upp i `runQualityChecks()` och `calculateQualityScore()`. **One Level of Abstraction**: Blandar koordinering med implementation. |
| `analyzeFunctions` | ~20 | **Small**: För lång (borde vara 4-5 rader enligt Martin). **Do one thing**: Tar bort kommentarer, loopar patterns, filtrerar keywords, bygger resultat. Borde vara separata funktioner. |
| `checkBalancedBrackets` | ~18 | **Output Arguments**: `issues` är en output parameter vilket Martin avråder från. Borde returnera array istället. **Command Query Separation**: Namnet låter som query men funktionen muterar input. |

### Kapitelreflektion kap 3
När jag tittar på min kod utifån kapitlet inser jag att många funktioner bryter mot detta. Min analyzeCodeQuality är för stor. Martin förespråkar funktioner på fyra till fem rader, medan mina är femton till tjugofem rader. Först tyckte jag det var omöjligt, men jag inser att kortare funktioner skulle göra koden mer läsbar som en berättelse.

Ett konkret problem är mina output arguments där jag muterar issues-arrayen. Martin är tydlig med att detta är svårt att förstå. Jag borde returnera värden istället. När det gäller antal argument har jag mestadels två, vilket är acceptabelt, men många kunde förenklas genom att hämta data internt.

Den viktigaste lärdomen är regeln om en abstraktionsnivå per funktion. Min analyzeFunctions blandar high-level koordinering med low-level regex-loopar, vilket gör den svår att läsa, vilket jag hade och har fortfarande svårt med. Om jag skulle omarbeta koden skulle jag dela upp långa funktioner, eliminera output arguments, och ge funktioner tydligare namn.

---

## Reflektion över egen kodkvalitet
Jag lärde mig efter idag när man gjorde code review i par, då man kollade på sin kod också från sin par kompis perspektiv hur konstigt ens egna kod kan se ut. Vissa själklara saker, visa mindre själklara.

**Största problemen**:
1. Funktioner gör för många saker och blandar abstraktionsnivåer
2. Inkonsekvent namngivning (`content` vs `code` vs `codeOnly`)
3. Output arguments gör koden svår att följa
4. För långa funktioner (15-25 rader istället för 5-10)
5. Tänka mer på top-down reading.

**Positiva aspekter**:
- Verb för metoder, substantiv för klasser
- Ingen global state
- Bra separation mellan parser, analyzer och index

**Om jag skulle börja om**:
1. Dela upp långa funktioner i mindre.
2. Ta bort output arguments - returnera värden istället.
3. Konsekvent namngivning med kontext.
4. Ge variabler mer specifika namn.

**Slutsats**: Min modul fungerar men är inte optimal för underhåll. Största förbättringar: kortare funktioner, eliminera output arguments, konsekvent namngivning.