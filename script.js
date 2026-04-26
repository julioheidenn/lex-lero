const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const traceList = document.getElementById("trace-list");
const modeSelect = document.getElementById("mode");
const intensitySlider = document.getElementById("intensity");
const intensityLabel = document.getElementById("intensity-label");
const statsBadge = document.getElementById("stats-badge");
const modeBadge = document.getElementById("mode-badge");
const copyButton = document.getElementById("copy-button");
const clearButton = document.getElementById("clear-button");
const exampleButton = document.getElementById("example-button");
const fillExampleHero = document.getElementById("fill-example-hero");
const randomizeHero = document.getElementById("randomize-hero");
const composer = document.getElementById("composer");
const exampleList = document.getElementById("example-list");

const STORAGE_KEYS = {
  input: "lex-lero.input",
  mode: "lex-lero.mode",
  intensity: "lex-lero.intensity",
};

const examples = [
  "o senhor é um vagbundo corrupto",
  "você mentiu para mim",
  "esse serviço é ruim",
  "pare de encher o saco",
  "vossa senhoria não pagou a conta",
];

const modeLabels = {
  peticao: "Petição",
  parecer: "Parecer",
  sentenca: "Sentença",
  despacho: "Despacho",
};

const intensityLabels = {
  1: "Seco",
  2: "Comedido",
  3: "Equilibrado",
  4: "Rebuscado",
  5: "Maximalista",
};

const modeOpeners = {
  peticao: ["Com a devida vênia", "Data venia", "Em apertada síntese"],
  parecer: ["Em análise perfunctória", "À luz de exame preliminar", "Após cognição sumária"],
  sentenca: ["Restou evidenciado", "Ficou assentado", "À vista do conjunto fático"],
  despacho: ["Consigno", "Registro", "Determino"],
};

const modeClosers = {
  peticao: [", para os fins de direito.", ", sem prejuízo de ulterior deliberação."],
  parecer: [", ao menos em tese.", ", sem embargo de melhor exame."],
  sentenca: [", por conseguinte.", ", em definitivo."],
  despacho: [", para ciência e cumprimento.", ", com as cautelas de estilo."],
};

const garnishWords = [
  "data venia",
  "em tese",
  "s.m.j.",
  "à luz da melhor técnica",
  "por cautela",
  "consoante se extrai dos autos",
];

const subjectRules = [
  { pattern: /\bo\s+senhor\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\ba\s+senhora\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\bsenhor(a)?\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\bvoc[êe]\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\bvc\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\btu\b/gi, replacement: "Vossa Senhoria" },
  { pattern: /\bseu\b/gi, replacement: "de Vossa Senhoria" },
  { pattern: /\bsua\b/gi, replacement: "de Vossa Senhoria" },
];

const phraseRules = [
  {
    pattern: /\bvagbund[oa]s?\s+corrupt[oa]s?\b/gi,
    replacement: "indivíduo avesso ao labor e eivado de vícios éticos e morais",
  },
  {
    pattern: /\bvag[aã]bund[oa]s?\s+corrupt[oa]s?\b/gi,
    replacement: "indivíduo avesso ao labor e eivado de vícios éticos e morais",
  },
  { pattern: /\bvagbund[oa]s?\b/gi, replacement: "indivíduo avesso ao labor" },
  { pattern: /\bvag[aã]bund[oa]s?\b/gi, replacement: "indivíduo avesso ao labor" },
  { pattern: /\bcorrupt[oa]s?\b/gi, replacement: "eivado de vícios éticos e morais" },
  { pattern: /\bmentiros[oa]s?\b/gi, replacement: "propenso a afirmações desconformes com a verdade" },
  { pattern: /\bladr[aã]os?\b/gi, replacement: "agente de subtração patrimonial" },
  { pattern: /\bburr[oa]s?\b/gi, replacement: "dotado de discernimento cognitivo reduzido" },
  { pattern: /\bidiot[oa]s?\b/gi, replacement: "de raciocínio notoriamente pouco inspirado" },
  { pattern: /\babsurd[oa]s?\b/gi, replacement: "destituído de razoabilidade" },
  { pattern: /\bchat[oa]s?\b/gi, replacement: "de convivência processualmente extenuante" },
  { pattern: /\bdesonest[oa]s?\b/gi, replacement: "incompatível com a boa-fé objetiva" },
  { pattern: /\bcaloteir[oa]s?\b/gi, replacement: "inadimplente contumaz" },
  { pattern: /\bnojent[oa]s?\b/gi, replacement: "de postura socialmente reprovável" },
  { pattern: /\bfroux[oa]s?\b/gi, replacement: "de diligência insuficiente" },
  { pattern: /\bmalandr[oa]s?\b/gi, replacement: "especialista em condutas de duvidosa lisura" },
  { pattern: /\bfei[oa]s?\b/gi, replacement: "de estética manifestamente desfavorável" },
  { pattern: /\bruim\b/gi, replacement: "de qualidade objetivamente questionável" },
  { pattern: /\bproblema(s)?\b/gi, replacement: "questão controvertida" },
  { pattern: /\bbesteira(s)?\b/gi, replacement: "alegação desprovida de lastro" },
];

const actionRules = [
  { pattern: /\bpare de\b/gi, replacement: "abstenha-se de" },
  { pattern: /\bencher o saco\b/gi, replacement: "produzir perturbação de convivência" },
  { pattern: /\bn[aã]o\s+pagou\b/gi, replacement: "não adimpliu" },
  { pattern: /\bpagou\b/gi, replacement: "adimpliu" },
  { pattern: /\bpagar\b/gi, replacement: "adimplir" },
  { pattern: /\bdevolva\b/gi, replacement: "restitua" },
  { pattern: /\bdevolver\b/gi, replacement: "restituir" },
  { pattern: /\bdevolveu\b/gi, replacement: "restituiu" },
  { pattern: /\bmentiu\b/gi, replacement: "aduziu narrativa desconforme com a verdade" },
  { pattern: /\bfalou\b/gi, replacement: "manifestou-se verbalmente" },
  { pattern: /\bdisse\b/gi, replacement: "aduziu" },
  { pattern: /\bquerer\b/gi, replacement: "almejar" },
  { pattern: /\bquer\b/gi, replacement: "almeja" },
  { pattern: /\bfez\b/gi, replacement: "promoveu" },
  { pattern: /\bfaz\b/gi, replacement: "promove" },
  { pattern: /\best[aá]\b/gi, replacement: "encontra-se" },
  { pattern: /\bfoi\b/gi, replacement: "restou" },
  { pattern: /\btem\b/gi, replacement: "detém" },
  { pattern: /\bpara mim\b/gi, replacement: "a esta parte" },
  { pattern: /\bcomigo\b/gi, replacement: "com esta parte" },
];

const structureRules = [
  { pattern: /\bvossa senhoria\s+é\s+um\b/gi, replacement: "Vossa Senhoria ostenta a condição de um" },
  { pattern: /\bvossa senhoria\s+é\s+uma\b/gi, replacement: "Vossa Senhoria ostenta a condição de uma" },
  { pattern: /\bvossa senhoria\s+é\s+/gi, replacement: "Vossa Senhoria apresenta" },
  { pattern: /\bvossa senhoria\s+est[aá]\s+/gi, replacement: "Vossa Senhoria encontra-se " },
  { pattern: /\bvossa senhoria\s+tem\s+/gi, replacement: "Vossa Senhoria detém " },
  { pattern: /\bvossa senhoria\s+faz\s+/gi, replacement: "Vossa Senhoria promove " },
  { pattern: /\bvossa senhoria\s+fala\s+/gi, replacement: "Vossa Senhoria se manifesta verbalmente " },
  { pattern: /\bvossa senhoria\s+quer\s+/gi, replacement: "Vossa Senhoria almeja " },
];

const fallbackOpeners = [
  "Consoante se verifica",
  "À vista do relatado",
  "No presente contexto",
  "Em juízo de cognição sumária",
];

function seedFromString(value) {
  let seed = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    seed ^= value.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return seed >>> 0;
}

function mulberry32(seed) {
  let t = seed >>> 0;

  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripTerminalPunctuation(value) {
  return value.replace(/[\s]*[.!?…]+$/u, "").trim();
}

function capitalize(value) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function uniquePush(list, value) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function applyRules(value, rules, trace) {
  let result = value;

  rules.forEach((rule) => {
    result = result.replace(rule.pattern, (match) => {
      uniquePush(trace, `${match} → ${rule.replacement}`);
      return rule.replacement;
    });
  });

  return result;
}

function insertAfterFirstComma(value, insertion) {
  const commaIndex = value.indexOf(",");

  if (commaIndex === -1) {
    return `${value}, ${insertion}`;
  }

  return `${value.slice(0, commaIndex + 1)} ${insertion},${value.slice(commaIndex + 1)}`;
}

function renderTrace(items) {
  traceList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("span");
    empty.className = "trace-empty";
    empty.textContent = "Ainda não há trocas para mostrar.";
    traceList.appendChild(empty);
    return;
  }

  items.slice(0, 8).forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "trace-chip";
    chip.textContent = item;
    traceList.appendChild(chip);
  });
}

function renderStats(traceCount, inputCount, outputCount, mode, intensity) {
  statsBadge.textContent = `${traceCount} trocas • ${inputCount}→${outputCount} palavras`;
  modeBadge.textContent = modeLabels[mode];
  intensityLabel.textContent = intensityLabels[intensity];
}

function buildOutput(input, mode, intensity) {
  const source = normalizeText(input).toLowerCase();
  const trace = [];

  if (!source) {
    return {
      output: "Digite uma frase para obter a versão em juridiquês.",
      trace,
      empty: true,
    };
  }

  const rng = mulberry32(seedFromString(`${source}|${mode}|${intensity}`));
  let working = source;

  working = applyRules(working, subjectRules, trace);
  working = applyRules(working, phraseRules, trace);
  working = applyRules(working, actionRules, trace);
  working = applyRules(working, structureRules, trace);

  working = normalizeText(working);
  working = stripTerminalPunctuation(working);

  const openerPool = modeOpeners[mode] ?? fallbackOpeners;
  const closerPool = modeClosers[mode] ?? ["."]; // never expected, but safe.
  const opener = pick(openerPool, rng);
  const closer = pick(closerPool, rng);

  let sentence = `${opener}, ${working}${closer}`;

  if (intensity >= 2) {
    const garnish = pick(garnishWords, rng);
    sentence = insertAfterFirstComma(sentence, garnish);
    uniquePush(trace, `ornamento estilístico → ${garnish}`);
  }

  if (intensity >= 4) {
    const garnish = pick(garnishWords, rng);
    sentence = insertAfterFirstComma(sentence, garnish);
    uniquePush(trace, `ornamento estilístico → ${garnish}`);
  }

  sentence = normalizeText(sentence);
  sentence = sentence.replace(/\s+,/g, ",");
  sentence = sentence.replace(/,\s+,/g, ", ");
  sentence = capitalize(sentence);

  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }

  return {
    output: sentence,
    trace,
    empty: false,
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.input, inputText.value);
    localStorage.setItem(STORAGE_KEYS.mode, modeSelect.value);
    localStorage.setItem(STORAGE_KEYS.intensity, intensitySlider.value);
  } catch {
    // Ignora falhas de armazenamento local.
  }
}

function loadState() {
  let hasSavedInput = false;

  try {
    const savedInput = localStorage.getItem(STORAGE_KEYS.input);
    const savedMode = localStorage.getItem(STORAGE_KEYS.mode);
    const savedIntensity = localStorage.getItem(STORAGE_KEYS.intensity);

    if (savedInput !== null) {
      hasSavedInput = true;
      inputText.value = savedInput;
    }

    if (savedMode && modeLabels[savedMode]) {
      modeSelect.value = savedMode;
    }

    if (savedIntensity) {
      const parsed = Number(savedIntensity);

      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 5) {
        intensitySlider.value = String(parsed);
      }
    }
  } catch {
    // Sem persistência, o app segue normalmente.
  }

  return hasSavedInput;
}

function syncAndRender() {
  const mode = modeSelect.value;
  const intensity = Number(intensitySlider.value);
  const result = buildOutput(inputText.value, mode, intensity);

  outputText.textContent = result.output;
  outputText.classList.toggle("is-empty", result.empty);
  renderTrace(result.trace);

  const inputCount = normalizeText(inputText.value)
    ? normalizeText(inputText.value).split(" ").length
    : 0;
  const outputCount = result.empty ? 0 : normalizeText(result.output).split(" ").length;

  renderStats(result.trace.length, inputCount, outputCount, mode, intensity);
  saveState();

  return result;
}

async function copyResult() {
  const text = outputText.textContent?.trim() || "";

  if (!text || outputText.classList.contains("is-empty")) {
    return;
  }

  const originalLabel = copyButton.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copiado";
    setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1400);
  } catch {
    copyButton.textContent = "Falha ao copiar";
    setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1400);
  }
}

function loadExample(example) {
  inputText.value = example;
  syncAndRender();
  inputText.focus();
  inputText.setSelectionRange(inputText.value.length, inputText.value.length);
}

function randomExample() {
  const modeKeys = Object.keys(modeLabels);
  const intensityValue = String(1 + Math.floor(Math.random() * 5));

  modeSelect.value = pick(modeKeys, () => Math.random());
  intensitySlider.value = intensityValue;
  loadExample(pick(examples, () => Math.random()));
}

exampleList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const example = target.dataset.example;

  if (example) {
    loadExample(example);
  }
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  syncAndRender();
});

inputText.addEventListener("input", syncAndRender);
modeSelect.addEventListener("change", syncAndRender);
intensitySlider.addEventListener("input", syncAndRender);

copyButton.addEventListener("click", copyResult);
clearButton.addEventListener("click", () => {
  inputText.value = "";
  syncAndRender();
  inputText.focus();
});
exampleButton.addEventListener("click", () => {
  loadExample(examples[0]);
});
fillExampleHero.addEventListener("click", () => {
  loadExample(examples[0]);
});
randomizeHero.addEventListener("click", randomExample);

const hasSavedInput = loadState();

if (!hasSavedInput && !inputText.value.trim()) {
  loadExample(examples[0]);
} else {
  syncAndRender();
}
