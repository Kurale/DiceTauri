# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **web-based math worksheet generator** for 5th grade students learning fractions and mixed numbers. The application is entirely **client-side vanilla JavaScript** with no build system or dependencies - just open `index.html` in a browser to run.

Target audience: Russian-speaking students and teachers. All UI text is in Russian.

## Running the Application

```bash
# Option 1: Open directly in a browser
open index.html

# Option 2: Serve with a local server (e.g., Python)
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

There is no build step, no npm install, and no testing framework.

## Code Architecture

The application consists of exactly three files:

- **`index.html`** - Page structure and UI controls
- **`script.js`** - All application logic
- **`styles.css`** - Styling (including print media queries)

### Core Concepts in `script.js`

1. **Number Representation**: Numbers are represented as objects with a `type` property:
   - `{ type: 'whole', value: n }` - Whole numbers
   - `{ type: 'fraction', n: numerator, d: denominator }` - Common fractions (always reduced)
   - `{ type: 'mixed', whole: w, n: numerator, d: denominator }` - Mixed numbers

2. **Mathematical Operations**:
   - `reduceFraction()` - Reduces fractions using GCD
   - `toImproper()` - Converts mixed numbers to improper fractions
   - `gcd()` - Greatest common divisor (Euclidean algorithm)

3. **Generation Pipeline**:
   - User selects topics (checkbox values like `'fractions_add_sub'`, `'mixed_mul'`, etc.)
   - `generateByTopic(topic)` creates a single problem `{ left, op, right }`
   - `buildExampleHtml()` formats the problem with answer blank
   - `render()` generates all variants and updates DOM

4. **Topics and Operations**:
   - Topics map to default operations: add/sub topics use `['+', '−']`, multiplication uses `['×']`, division uses `[':']`
   - Operation mode (`operationMode` select) can override: `'auto'`, `'all'`, `'addsub'`, `'muldiv'`
   - Subtraction problems are auto-reordered so result is always non-negative

5. **HTML Export**: `copyHtml()` creates a self-contained HTML document with inline styles for pasting into worksheet editors

## Key Constraints

- Fractions are generated with denominators 2-12 (configurable via `maxDen` parameter)
- Whole numbers are 1-9 (configurable via `maxWhole`)
- Mixed numbers have proper fractional part (numerator < denominator)
- All fractions are automatically reduced using `reduceFraction()`
- Subtraction always yields non-negative results (operands swapped if needed)
- Division by zero is prevented

## Print Styling

The `@media print` block in `styles.css` hides controls and ensures worksheets print correctly across page breaks.
