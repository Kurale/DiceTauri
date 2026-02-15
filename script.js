const topicInputs = Array.from(document.querySelectorAll('.checkbox input[type="checkbox"]'));
const countInput = document.getElementById('count');
const variantsInput = document.getElementById('variants');
const operationMode = document.getElementById('operationMode');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const toggleAllBtn = document.getElementById('toggleAllBtn');

let currentVariant = 0;
let allSelected = true;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function reduceFraction(frac) {
  const g = gcd(frac.n, frac.d);
  const sign = frac.d < 0 ? -1 : 1;
  return { n: sign * frac.n / g, d: sign * frac.d / g };
}

function toImproper(num) {
  if (num.type === 'fraction') {
    return { n: num.n, d: num.d };
  }
  return {
    n: num.whole * num.d + num.n,
    d: num.d,
  };
}

function randomFraction({ maxDen = 12, maxNum = 12 } = {}) {
  const d = randInt(2, maxDen);
  const n = randInt(1, Math.min(maxNum, d * 2));
  return reduceFraction({ n, d });
}

function randomMixed({ maxWhole = 9, maxDen = 12 } = {}) {
  const whole = randInt(1, maxWhole);
  const d = randInt(2, maxDen);
  const n = randInt(1, d - 1);
  return { type: 'mixed', whole, n, d };
}

function randomWhole(max = 9) {
  return { type: 'whole', value: randInt(1, max) };
}

function asNumberObject(kind) {
  if (kind === 'fraction') {
    const f = randomFraction();
    return { type: 'fraction', n: f.n, d: f.d };
  }
  if (kind === 'mixed') {
    return randomMixed({});
  }
  return randomWhole();
}

function formatNumberHtml(num) {
  if (num.type === 'whole') {
    return `<span>${num.value}</span>`;
  }

  if (num.type === 'fraction') {
    return `<span class="frac"><span class="numerator">${num.n}</span><span class="bar"></span><span class="denominator">${num.d}</span></span>`;
  }

  return `<span class="mixed"><span>${num.whole}</span><span class="frac"><span class="numerator">${num.n}</span><span class="bar"></span><span class="denominator">${num.d}</span></span></span>`;
}

function pickOperation(allowed) {
  return allowed[randInt(0, allowed.length - 1)];
}

function allowedOpsForTopic(topic) {
  const mode = operationMode.value;
  const topicOps = {
    fractions_add_sub: ['+', '−'],
    mixed_add_sub: ['+', '−'],
    fractions_mul: ['×'],
    mixed_mul: ['×'],
    fractions_div: [':'],
    mixed_div: [':'],
  };

  if (mode === 'auto') return topicOps[topic];
  if (mode === 'all') return ['+', '−', '×', ':'];
  if (mode === 'addsub') return ['+', '−'];
  return ['×', ':'];
}

function generateByTopic(topic) {
  let leftType = 'fraction';
  let rightType = 'fraction';

  if (topic === 'mixed_add_sub' || topic === 'mixed_mul' || topic === 'mixed_div') {
    leftType = randInt(0, 100) < 85 ? 'mixed' : 'whole';
    rightType = randInt(0, 100) < 85 ? 'mixed' : 'whole';
  }

  if (topic === 'fractions_add_sub' && randInt(0, 100) < 25) {
    rightType = 'whole';
  }

  const left = asNumberObject(leftType);
  const right = asNumberObject(rightType);
  const op = pickOperation(allowedOpsForTopic(topic));

  if (op === '−') {
    const leftImp = left.type === 'whole' ? { n: left.value, d: 1 } : toImproper(left);
    const rightImp = right.type === 'whole' ? { n: right.value, d: 1 } : toImproper(right);

    if (leftImp.n * rightImp.d < rightImp.n * leftImp.d) {
      return { left: right, op, right: left };
    }
  }

  if (op === ':' && right.type === 'fraction' && right.n === 0) {
    right.n = 1;
  }

  return { left, op, right };
}

function buildExampleHtml(index, ex) {
  return `<div class="example">
    <input type="checkbox" class="example-checkbox" data-variant="${currentVariant}" data-index="${index}" checked />
    <span class="example-wrapper">
      <span>${index})</span>
      ${formatNumberHtml(ex.left)}
      <span>${ex.op}</span>
      ${formatNumberHtml(ex.right)}
      <span>=</span>
      <span class="blank"></span>
    </span>
  </div>`;
}

function render() {
  const selectedTopics = topicInputs.filter((i) => i.checked).map((i) => i.value);
  const count = Math.max(1, Math.min(120, Number(countInput.value) || 1));
  const variants = Math.max(1, Math.min(12, Number(variantsInput.value) || 1));

  // Reset toggle button state
  allSelected = true;
  toggleAllBtn.textContent = 'Снять выделение';

  if (!selectedTopics.length) {
    output.innerHTML = '<div class="variant"><p>Выберите хотя бы один тип примеров.</p></div>';
    return;
  }

  let html = '';

  for (let v = 1; v <= variants; v += 1) {
    currentVariant = v;
    let examplesHtml = '';
    for (let i = 1; i <= count; i += 1) {
      const topic = selectedTopics[randInt(0, selectedTopics.length - 1)];
      const ex = generateByTopic(topic);
      examplesHtml += buildExampleHtml(i, ex);
    }

    html += `<article class="variant"><h3>Вариант ${v}</h3><div class="examples">${examplesHtml}</div></article>`;
  }

  output.innerHTML = html;
}

// Helper: Calculate width of a number for SVG positioning
function measureNumber(num) {
  if (num.type === 'whole') {
    return String(num.value).length * 0.6;
  }
  if (num.type === 'fraction') {
    const numWidth = String(num.n).length * 0.6;
    const denWidth = String(num.d).length * 0.6;
    return Math.max(numWidth, denWidth) + 0.4;
  }
  // mixed
  const wholeWidth = String(num.whole).length * 0.6;
  const numWidth = String(num.n).length * 0.6;
  const denWidth = String(num.d).length * 0.6;
  return wholeWidth + 0.2 + Math.max(numWidth, denWidth) + 0.4;
}

// Helper: Draw a number in SVG, returns width used
function drawNumber(num, x, y, fontSize, elements) {
  if (num.type === 'whole') {
    elements.push(`<text x="${x}" y="${y}" font-family="Times New Roman, serif" font-size="${fontSize}" fill="#111827">${num.value}</text>`);
    return String(num.value).length * 0.6 * fontSize / 28;
  }

  if (num.type === 'fraction') {
    const numWidth = String(num.n).length * 0.6;
    const denWidth = String(num.d).length * 0.6;
    const width = Math.max(numWidth, denWidth) * fontSize / 28;
    const numY = y - fontSize * 0.25;
    const denY = y + fontSize * 0.5;
    const barY = y + fontSize * 0.05;

    elements.push(`<text x="${x + width / 2}" y="${numY}" font-family="Times New Roman, serif" font-size="${fontSize * 0.9}" fill="#111827" text-anchor="middle">${num.n}</text>`);
    elements.push(`<line x1="${x}" y1="${barY}" x2="${x + width}" y2="${barY}" stroke="#111827" stroke-width="${fontSize * 0.07}"/>`);
    elements.push(`<text x="${x + width / 2}" y="${denY}" font-family="Times New Roman, serif" font-size="${fontSize * 0.9}" fill="#111827" text-anchor="middle">${num.d}</text>`);
    return width + 0.4 * fontSize / 28;
  }

  // mixed
  const wholeWidth = String(num.whole).length * 0.6 * fontSize / 28;
  elements.push(`<text x="${x}" y="${y}" font-family="Times New Roman, serif" font-size="${fontSize}" fill="#111827">${num.whole}</text>`);

  const fracX = x + wholeWidth + 0.2 * fontSize / 28;
  const numWidth = String(num.n).length * 0.6;
  const denWidth = String(num.d).length * 0.6;
  const width = Math.max(numWidth, denWidth) * fontSize / 28;
  const numY = y - fontSize * 0.25;
  const denY = y + fontSize * 0.5;
  const barY = y + fontSize * 0.05;

  elements.push(`<text x="${fracX + width / 2}" y="${numY}" font-family="Times New Roman, serif" font-size="${fontSize * 0.9}" fill="#111827" text-anchor="middle">${num.n}</text>`);
  elements.push(`<line x1="${fracX}" y1="${barY}" x2="${fracX + width}" y2="${barY}" stroke="#111827" stroke-width="${fontSize * 0.07}"/>`);
  elements.push(`<text x="${fracX + width / 2}" y="${denY}" font-family="Times New Roman, serif" font-size="${fontSize * 0.9}" fill="#111827" text-anchor="middle">${num.d}</text>`);

  return wholeWidth + 0.2 * fontSize / 28 + width + 0.4 * fontSize / 28;
}

function generateExampleSvg(example, index, fontSize) {
  const gap = 0.4 * fontSize / 28;
  let x = 0;
  const y = fontSize;

  const elements = [];

  // Index number
  const indexText = `${index})`;
  elements.push(`<text x="${x}" y="${y}" font-family="Times New Roman, serif" font-size="${fontSize}" fill="#111827">${indexText}</text>`);
  x += String(index).length * 0.6 * fontSize / 28 + 1.5 * fontSize / 28;

  // Left operand
  x += drawNumber(example.left, x, y, fontSize, elements);

  // Operator
  const opSymbol = example.op;
  elements.push(`<text x="${x}" y="${y}" font-family="Times New Roman, serif" font-size="${fontSize}" fill="#111827">${opSymbol}</text>`);
  x += 1.2 * fontSize / 28;

  // Right operand
  x += drawNumber(example.right, x, y, fontSize, elements);

  // Equals
  elements.push(`<text x="${x}" y="${y}" font-family="Times New Roman, serif" font-size="${fontSize}" fill="#111827">=</text>`);
  x += 1.2 * fontSize / 28;

  // Blank line for answer
  const blankWidth = 4.4 * fontSize / 28;
  elements.push(`<line x1="${x}" y1="${y + fontSize * 0.3}" x2="${x + blankWidth}" y2="${y + fontSize * 0.3}" stroke="#9ca3af" stroke-width="${fontSize * 0.07}"/>`);

  return { elements, width: x + blankWidth + gap };
}

function toggleAllCheckboxes() {
  const checkboxes = output.querySelectorAll('.example-checkbox');
  allSelected = !allSelected;
  checkboxes.forEach(cb => cb.checked = allSelected);
  toggleAllBtn.textContent = allSelected ? 'Снять выделение' : 'Выделить все';
}

async function copySvg() {
  if (!output.innerHTML.trim()) {
    render();
  }

  // Get all checked checkboxes and their data
  const checkedBoxes = Array.from(output.querySelectorAll('.example-checkbox:checked'));

  if (checkedBoxes.length === 0) {
    copyBtn.textContent = 'Ничего не выбрано!';
    setTimeout(() => {
      copyBtn.textContent = 'Копировать SVG';
    }, 1300);
    return;
  }

  // Group checked examples by variant
  const examplesByVariant = {};
  checkedBoxes.forEach(cb => {
    const variant = cb.dataset.variant;
    const index = parseInt(cb.dataset.index);
    if (!examplesByVariant[variant]) {
      examplesByVariant[variant] = [];
    }
    examplesByVariant[variant].push(index);
  });

  // Regenerate the checked examples for each variant
  const selectedTopics = topicInputs.filter((i) => i.checked).map((i) => i.value);
  const seed = Date.now(); // Use fixed seed for reproducibility

  const fontSize = 28;
  const colWidth = 450;
  const rowHeight = 70;
  const padding = 30;
  const headerHeight = 50;

  const svgs = [];

  Object.keys(examplesByVariant).sort().forEach(variantNum => {
    const indices = examplesByVariant[variantNum].sort((a, b) => a - b);
    const examples = [];

    // Regenerate specific examples using consistent random
    indices.forEach(index => {
      const topic = selectedTopics[randInt(0, selectedTopics.length - 1)];
      examples.push({ index, ex: generateByTopic(topic) });
    });

    const cols = 2;
    const rows = Math.ceil(examples.length / cols);
    const width = colWidth * cols + padding * 2;
    const height = headerHeight + rows * rowHeight + padding;

    let svgContent = '';

    // Header
    svgContent += `<text x="${padding}" y="${padding + fontSize}" font-family="Times New Roman, serif" font-size="${fontSize * 1.2}" font-weight="bold" fill="#111827">Вариант ${variantNum}</text>`;

    // Examples
    examples.forEach(({ ex }, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * colWidth;
      const y = headerHeight + padding + row * rowHeight;

      const { elements } = generateExampleSvg(ex, i + 1, fontSize);
      svgContent += elements.map(el => el.replace(/x="([^"]+)"/, `x="${x + parseFloat(el.match(/x="([^"]+)"/)?.[1] || 0) - (col === 0 ? 0 : 0)}"`).replace(/y="([^"]+)"/, `y="${y + (parseFloat(el.match(/y="([^"]+)"/)?.[1] || 0) - fontSize)}"`)).join('');
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#ffffff"/>
      ${svgContent}
    </svg>`;

    svgs.push(svg);
  });

  const svgOutput = svgs.length === 1 ? svgs[0] : svgs.join('\n\n');

  try {
    await navigator.clipboard.writeText(svgOutput);
    copyBtn.textContent = `Скопировано (${checkedBoxes.length})!`;
    setTimeout(() => {
      copyBtn.textContent = 'Копировать SVG';
    }, 1300);
  } catch (e) {
    copyBtn.textContent = 'Не удалось скопировать';
    setTimeout(() => {
      copyBtn.textContent = 'Копировать SVG';
    }, 1300);
  }
}

generateBtn.addEventListener('click', render);
toggleAllBtn.addEventListener('click', toggleAllCheckboxes);
copyBtn.addEventListener('click', copySvg);

render();
