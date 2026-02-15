const topicInputs = Array.from(document.querySelectorAll('.checkbox input[type="checkbox"]'));
const countInput = document.getElementById('count');
const variantsInput = document.getElementById('variants');
const operationMode = document.getElementById('operationMode');
const output = document.getElementById('output');
const generateBtn = document.getElementById('generateBtn');
const copySvgBtn = document.getElementById('copySvgBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const selectAllBtn = document.getElementById('selectAllBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');

let generated = [];

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

  return { left, op, right };
}

function buildExampleHtml(variantIndex, index, ex) {
  return `<div class="example-row">
    <label class="pick">
      <input class="example-pick" type="checkbox" data-variant="${variantIndex}" data-index="${index}" checked />
      <span></span>
    </label>
    <div class="example">
      <span>${index + 1})</span>
      ${formatNumberHtml(ex.left)}
      <span>${ex.op}</span>
      ${formatNumberHtml(ex.right)}
      <span>=</span>
      <span class="blank"></span>
    </div>
  </div>`;
}

function render() {
  const selectedTopics = topicInputs.filter((i) => i.checked).map((i) => i.value);
  const count = Math.max(1, Math.min(120, Number(countInput.value) || 1));
  const variants = Math.max(1, Math.min(12, Number(variantsInput.value) || 1));

  if (!selectedTopics.length) {
    output.innerHTML = '<div class="variant"><p>Выберите хотя бы один тип примеров.</p></div>';
    generated = [];
    return;
  }

  generated = [];
  let html = '';

  for (let v = 0; v < variants; v += 1) {
    let examplesHtml = '';
    const examples = [];

    for (let i = 0; i < count; i += 1) {
      const topic = selectedTopics[randInt(0, selectedTopics.length - 1)];
      const ex = generateByTopic(topic);
      examples.push(ex);
      examplesHtml += buildExampleHtml(v, i, ex);
    }

    generated.push({ variantNumber: v + 1, examples });
    html += `<article class="variant"><h3>Вариант ${v + 1}</h3><div class="examples">${examplesHtml}</div></article>`;
  }

  output.innerHTML = html;
}

function getSelectedExamples() {
  const picks = Array.from(document.querySelectorAll('.example-pick:checked'));
  return picks
    .map((pick) => {
      const variant = Number(pick.dataset.variant);
      const index = Number(pick.dataset.index);
      const variantData = generated[variant];
      if (!variantData || !variantData.examples[index]) return null;
      return {
        variantNumber: variantData.variantNumber,
        index: index + 1,
        example: variantData.examples[index],
      };
    })
    .filter(Boolean);
}

function estimateTextWidth(text, fontSize = 32) {
  return Math.max(20, text.length * (fontSize * 0.56));
}

function svgEscape(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function drawNumberSvg(num, x, yTop) {
  const font = 32;

  if (num.type === 'whole') {
    const text = String(num.value);
    const width = estimateTextWidth(text, font);
    const svg = `<text x="${x}" y="${yTop + 45}" font-size="${font}" font-family="Times New Roman">${svgEscape(text)}</text>`;
    return { width, svg };
  }

  if (num.type === 'fraction') {
    const top = String(num.n);
    const bottom = String(num.d);
    const fracWidth = Math.max(estimateTextWidth(top, 24), estimateTextWidth(bottom, 24), 40);
    const center = x + fracWidth / 2;
    const svg = `
      <text x="${center}" y="${yTop + 20}" font-size="24" text-anchor="middle" font-family="Times New Roman">${svgEscape(top)}</text>
      <line x1="${x}" y1="${yTop + 32}" x2="${x + fracWidth}" y2="${yTop + 32}" stroke="#111827" stroke-width="2" />
      <text x="${center}" y="${yTop + 58}" font-size="24" text-anchor="middle" font-family="Times New Roman">${svgEscape(bottom)}</text>
    `;
    return { width: fracWidth, svg };
  }

  const wholeText = String(num.whole);
  const wholeWidth = estimateTextWidth(wholeText, font);
  const frac = drawNumberSvg({ type: 'fraction', n: num.n, d: num.d }, x + wholeWidth + 10, yTop);
  const svg = `<text x="${x}" y="${yTop + 45}" font-size="${font}" font-family="Times New Roman">${svgEscape(wholeText)}</text>${frac.svg}`;
  return { width: wholeWidth + 10 + frac.width, svg };
}

function selectedExamplesToSvg(selected) {
  const sheetWidth = 1480;
  const margin = 40;
  const colWidth = 690;
  const rowHeight = 88;
  const titleHeight = 52;

  const grouped = new Map();
  for (const item of selected) {
    if (!grouped.has(item.variantNumber)) {
      grouped.set(item.variantNumber, []);
    }
    grouped.get(item.variantNumber).push(item);
  }

  let y = margin;
  let content = '';

  const variants = Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  for (const [variantNumber, rows] of variants) {
    content += `<text x="${margin}" y="${y}" font-size="34" font-family="Times New Roman" font-weight="bold">Вариант ${variantNumber}</text>`;
    y += titleHeight;

    rows.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const rowY = y + row * rowHeight;
      let cursor = margin + col * colWidth;

      content += `<text x="${cursor}" y="${rowY + 45}" font-size="32" font-family="Times New Roman">${item.index})</text>`;
      cursor += 50;

      const left = drawNumberSvg(item.example.left, cursor, rowY);
      content += left.svg;
      cursor += left.width + 22;

      content += `<text x="${cursor}" y="${rowY + 45}" font-size="32" font-family="Times New Roman">${svgEscape(item.example.op)}</text>`;
      cursor += 34;

      const right = drawNumberSvg(item.example.right, cursor, rowY);
      content += right.svg;
      cursor += right.width + 22;

      content += `<text x="${cursor}" y="${rowY + 45}" font-size="32" font-family="Times New Roman">=</text>`;
      cursor += 34;

      content += `<line x1="${cursor}" y1="${rowY + 46}" x2="${cursor + 150}" y2="${rowY + 46}" stroke="#9ca3af" stroke-width="2" />`;
    });

    const rowsCount = Math.ceil(rows.length / 2);
    y += rowsCount * rowHeight + 26;
  }

  const height = Math.max(220, y + margin);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${height}" viewBox="0 0 ${sheetWidth} ${height}">${content}</svg>`;
}

async function copySvg() {
  const selected = getSelectedExamples();
  if (!selected.length) {
    copySvgBtn.textContent = 'Нет отмеченных примеров';
    setTimeout(() => {
      copySvgBtn.textContent = 'Копировать SVG отмеченных';
    }, 1300);
    return;
  }

  const svg = selectedExamplesToSvg(selected);
  try {
    await navigator.clipboard.writeText(svg);
    copySvgBtn.textContent = 'SVG скопирован';
    setTimeout(() => {
      copySvgBtn.textContent = 'Копировать SVG отмеченных';
    }, 1300);
  } catch (e) {
    copySvgBtn.textContent = 'Не удалось скопировать';
    setTimeout(() => {
      copySvgBtn.textContent = 'Копировать SVG отмеченных';
    }, 1300);
  }
}

function downloadSvg() {
  const selected = getSelectedExamples();
  if (!selected.length) {
    downloadSvgBtn.textContent = 'Нет отмеченных примеров';
    setTimeout(() => {
      downloadSvgBtn.textContent = 'Скачать SVG отмеченных';
    }, 1300);
    return;
  }

  const svg = selectedExamplesToSvg(selected);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `drobi-worksheet-${new Date().toISOString().slice(0, 10)}.svg`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toggleAllExamples(state) {
  document.querySelectorAll('.example-pick').forEach((pick) => {
    pick.checked = state;
  });
}

generateBtn.addEventListener('click', render);
copySvgBtn.addEventListener('click', copySvg);
downloadSvgBtn.addEventListener('click', downloadSvg);
selectAllBtn.addEventListener('click', () => toggleAllExamples(true));
clearSelectionBtn.addEventListener('click', () => toggleAllExamples(false));

render();
