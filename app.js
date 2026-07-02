const SOURCE_ROOT = "https://rules.wftda.com";
const CASEBOOK_ROOT = `${SOURCE_ROOT}/casebook`;
const PASS_RATE = 80;
const COMMON_TEST_SHARE = 0.8;
const REQUIRED_BANK_QUESTION_COUNT = 150;
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxOltswq5hb9IgsiRl_UmGfQJlGDj1OB7rHjsIOqlAsvFQ7qP2ybfMlEcht8cev0xZz2VWBZFM4GhR/pub?output=csv";
const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1000;

const CASEBOOK_PAGE_BY_CHAPTER = {
  C2: "02_c_gameplay.html",
  C3: "03_c_scoring.html",
  C4: "04_c_penalties.html",
  C5: "05_c_officiating.html"
};

const RULE_ANCHOR_ALIASES = {
  "penalties-gaining-position": "penalties-structure-gaining-position",
  "penalties-multi-player-blocks": "penalties-multiplayer-blocks",
  "penalties-position": "penalties-structure-illegal-positioning"
};

const COMMON_CATEGORIES = new Set([
  "Jammer identity",
  "Lead Jammer",
  "Star Pass",
  "Starting positions",
  "Pack definition",
  "Passing",
  "Earning points",
  "Trips",
  "Scoring avoidance",
  "Penalized Jammers",
  "Illegal target zone",
  "Illegal blocking zone",
  "Other illegal contact",
  "Multi-Player Blocks",
  "Position and Pack",
  "Gaining position",
  "Game structure",
  "Blocker penalties",
  "Jammer penalties",
  "Assessing penalties"
]);

const OBSCURE_PATTERNS = [
  /expel|expulsion/i,
  /Team Staff|Captain/i,
  /Official/i,
  /mouthguard|protective gear/i,
  /substitute|injured|three jams/i,
  /water bottle|bench/i,
  /equipment/i
];

const LEARNING_PATH = [
  {
    title: "1. Track, roles, and starts",
    level: "Fundamentals",
    description: "Who is on the track, where they may start, and how the Pack is defined before judgment gets noisy.",
    categories: ["Jammer identity", "Starting positions", "Pack definition", "Passing"],
    focus: ["Roles and helmet covers", "False Starts", "Pack and No Pack", "Basic passing"]
  },
  {
    title: "2. Jam flow and Lead",
    level: "Core gameplay",
    description: "Build the mental timeline of a jam: initial trip, Lead status, Star visibility, and legal role changes.",
    categories: ["Lead Jammer", "Star Pass", "Game structure"],
    focus: ["Lead requirements", "Star Pass timing", "Calling and ending jams"]
  },
  {
    title: "3. Scoring that happens every game",
    level: "Common calls",
    description: "Move from simple passes to trips, not-on-the-track points, and scoring avoidance.",
    categories: ["Earning points", "Trips", "Scoring avoidance", "Penalized Jammers"],
    focus: ["Earned passes", "Scoring trips", "Unavailable blockers", "Jammer penalties"]
  },
  {
    title: "4. Contact penalties",
    level: "Impact judgment",
    description: "Separate legal derby contact from illegal target zones, illegal blocking zones, and sustained advantage.",
    categories: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Multi-Player Blocks"],
    focus: ["Back blocks", "Forearms", "Low blocks", "Links and multi-player actions"]
  },
  {
    title: "5. Position, re-entry, and penalties",
    level: "Applied judgment",
    description: "Layer Pack status, out-of-play blocks, re-entry, cutting, and penalty enforcement onto the core model.",
    categories: ["Position and Pack", "Gaining position", "Blocker penalties", "Jammer penalties", "Assessing penalties"],
    focus: ["Out of Play", "Cutting", "Penalty Box timing", "Who serves"]
  },
  {
    title: "6. Procedures and edge cases",
    level: "Advanced",
    description: "Finish with less common procedural, safety, misconduct, and expulsion scenarios after the common calls are stable.",
    categories: ["Illegal procedures", "Unsporting conduct", "Unsporting contact", "Expulsions", "Protective gear", "Unable to serve"],
    focus: ["Administrative fixes", "Misconduct", "Safety equipment", "Expulsions"]
  }
];

const STUDY_PRACTICE_GROUPS = {
  jam: ["Lead Jammer", "Starting positions", "Game structure"],
  roles: ["Jammer identity", "Star Pass", "Starting positions"],
  pack: ["Pack definition", "Position and Pack"],
  scoring: ["Earning points", "Trips", "Scoring avoidance", "Penalized Jammers"],
  contact: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Multi-Player Blocks"],
  penalties: ["Illegal target zone", "Illegal blocking zone", "Other illegal contact", "Position and Pack", "Gaining position", "Assessing penalties"],
  common: [...COMMON_CATEGORIES],
  star: ["Star Pass", "Jammer identity", "Lead Jammer"],
  box: ["Blocker penalties", "Jammer penalties", "Unable to serve", "Protective gear"]
};

const STUDY_PRACTICE_SECTIONS = {
  jam: "study-jam",
  roles: "study-roles",
  pack: "study-pack",
  scoring: "study-scoring",
  contact: "study-contact",
  penalties: "study-penalties",
  common: "study-common",
  star: "study-star-pass",
  box: "study-box"
};

const STORAGE = {
  stats: "wftdaAssessmentStats.v1",
  bookmarks: "wftdaAssessmentBookmarks.v1",
  tests: "wftdaAssessmentTests.v1",
  edits: "wftdaQuestionEdits.v1",
  originals: "wftdaQuestionOriginals.v1",
  remoteBank: "rollerDerbyRulesGymQuestionBank.v1"
};

const SESSION = {
  bankFetched: "rollerDerbyRulesGymQuestionBankFetched.v1"
};

function createQuestionBank(source = window.OFFICIAL_CASES || []) {
  return source.map((item) => {
    const correct = item.correct || item.outcome || "";
    const teachingNote = item.teachingNote || defaultTeachingNote(item);
    const distractors = item.distractors?.length
      ? item.distractors.map(capitalizeFirstAlpha)
      : derivedDistractors({ ...item, outcome: correct });
    return {
      id: item.id,
      seedId: item.id,
      section: item.section,
      category: item.category,
      studyTheme: item.studyTheme || studyThemeForCategory(item.category),
      caseId: item.caseId,
      caseAnchor: item.caseAnchor,
      caseUrl: normalizeWftdaCaseUrl(item.caseUrl, item.caseId, item.caseAnchor, item.rule),
      rule: item.rule,
      ruleAnchor: item.ruleAnchor,
      ruleUrl: normalizeWftdaRuleUrl(item.ruleUrl, item.ruleAnchor, item.rule),
      tags: item.tags || [],
      kind: item.outcomeLabel || "Outcome",
      scenario: item.scenario,
      context: item.context || defaultContextNote(item),
      prompt: item.prompt || defaultQuestionPrompt(item),
      correct,
      teachingNote: teachingNote || "The official answer follows from the cited rulebook section.",
      comment: item.comment || "",
      hasEdit: false,
      distractors,
      common: item.common ?? isCommonScenario(item)
    };
  });
}

function studyThemeForCategory(category) {
  const module = LEARNING_PATH.find((item) => item.categories.includes(category));
  if (module) return module.title;
  if (category === "Casebook") return LEARNING_PATH[0].title;
  if (category === "Penalty enforcement") return LEARNING_PATH[4].title;
  return LEARNING_PATH[5].title;
}

function defaultQuestionPrompt(item) {
  const answerType = (item.outcomeLabel || "Outcome").toLowerCase();
  return `What is the correct official ${answerType}?`;
}

function defaultContextNote(item) {
  const categoryLens = {
    "Jammer identity": "Track who is wearing the Star at the start, then separate role identity from starting-position penalties.",
    "Lead Jammer": "Check Star visibility, legal passes, and whether the Jammer has lost eligibility for Lead.",
    "Star Pass": "Watch when the Star is released, who controls it, and whether the Pivot legally receives it.",
    "Starting positions": "Compare each Skater's position at the Jam-Starting Whistle with the role they are actually performing.",
    "Pack definition": "Identify the largest group of in-bounds Blockers from both teams before deciding Pack or No Pack consequences.",
    "Passing": "Focus on whether the pass was legal, earned, and completed by hips, not just who appears ahead.",
    "Earning points": "Separate position gained from points earned, especially across trips and unavailable opponents.",
    "Trips": "Establish which scoring trip the Jammer is on before counting passes or not-on-the-track points.",
    "Scoring avoidance": "Look for deliberate actions that prevent a Jammer from earning a normal scoring opportunity.",
    "Penalized Jammers": "Track Jammer status through the penalty and whether points are earned before, during, or after service.",
    "Illegal target zone": "Find the initiating contact, the target zone, and the impact on the opponent's position or play.",
    "Illegal blocking zone": "Find the body part used to initiate the block and whether it created meaningful impact.",
    "Other illegal contact": "Judge the contact by initiation, legality, and impact rather than by the amount of movement alone.",
    "Multi-Player Blocks": "Check whether linked teammates created an impenetrable wall or materially impeded an opponent.",
    "Position and Pack": "Resolve Pack status and engagement-zone legality before judging the block or required return.",
    "Gaining position": "Compare superior position before going out with the re-entry position and any exceptions.",
    "Game structure": "Anchor the decision to jam timing, whistles, and whether play is live or between jams.",
    "Blocker penalties": "Identify which Blocker action caused the illegal advantage or impact.",
    "Jammer penalties": "Separate Jammer privileges from illegal contact, illegal position, or scoring consequences.",
    "Assessing penalties": "Focus on who committed the penalizable action and whether any additional penalty is required."
  };
  return categoryLens[item.category] || `Focus on ${item.rule}: identify the controlling fact in the scenario, then compare it to the official outcome.`;
}

function defaultTeachingNote(item) {
  return [item.rationale, item.keepInMind ? `Keep in Mind: ${item.keepInMind}` : ""]
    .filter(Boolean)
    .join("\n\n");
}

function isCommonScenario(item) {
  const combinedText = `${item.category} ${item.scenario} ${item.outcome} ${item.rationale}`;
  return COMMON_CATEGORIES.has(item.category) && !OBSCURE_PATTERNS.some((pattern) => pattern.test(combinedText));
}

function derivedDistractors(item) {
  const correct = item.outcome.trim();
  const options = [];
  const pointMatch = correct.match(/\b(zero|one|two|three|four|five|six|\d+)\s+points?\b/i);
  const isNoPenalty = /\bno penalty\b|not issued a penalty|not penalized/i.test(correct);
  const bothPenalized = correct.match(/^(.+?) and (.+?) are both penalized\.?$/i);
  const isStarPass = /Star Pass/i.test(correct);
  const isExpulsion = /expel|expulsion/i.test(correct);

  if (pointMatch) {
    const numberWords = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    const value = Number.isNaN(Number(pointMatch[1])) ? numberWords[pointMatch[1].toLowerCase()] : Number(pointMatch[1]);
    [Math.max(0, value - 1), value + 1, value === 4 ? 0 : 4].forEach((points) => {
      const label = ["zero", "one", "two", "three", "four", "five", "six"][points] || String(points);
      options.push(correct.replace(pointMatch[0], `${label} ${points === 1 ? "point" : "points"}`));
    });
  }

  if (bothPenalized) {
    options.push(`${bothPenalized[1]} is penalized; ${bothPenalized[2]} is not penalized.`);
    options.push(`${bothPenalized[2]} is penalized; ${bothPenalized[1]} is not penalized.`);
    options.push("No penalty is issued.");
  } else if (/warning|Yield/i.test(correct)) {
    options.push("The Skater is penalized immediately instead of being allowed to Yield.");
    options.push("The Skater keeps the warning and must continue to Yield until passed by nearby opponents.");
    options.push("No warning is issued, and the Skater may continue to play normally.");
  } else if (isNoPenalty) {
    options.push("Assess a penalty to the involved Skater.");
    options.push("Issue a formal warning as the complete official outcome.");
    options.push("Assess a penalty even though the action was immediately corrected.");
  } else if (/penal/i.test(correct)) {
    options.push("No penalty is issued.");
    options.push("Issue a warning, but do not assess a penalty.");
    options.push(correct.replace(/penalized|receives a penalty|is issued a penalty/gi, "warned"));
  }

  if (isStarPass) {
    if (/unsuccessful/i.test(correct)) {
      options.push("The Star Pass is successful, and the Pivot becomes the Jammer.");
      options.push("The Star Pass is unsuccessful, but the receiving Skater becomes the Jammer after dropping the Star.");
    } else {
      options.push("The Star Pass is unsuccessful, and both Skaters retain their existing Roles.");
      options.push("The Jammer keeps the role until the next Jam starts.");
    }
  }

  if (isExpulsion) {
    options.push("Issue a penalty, but do not expel the Skater.");
    options.push("No penalty and no expulsion are warranted.");
  }

  options.push("No penalty is issued.");
  options.push("Issue a warning only.");
  options.push("No penalty is issued because the action is treated as corrected.");

  return uniqueByText(options)
    .filter((option) => option.trim().toLowerCase() !== correct.trim().toLowerCase())
    .map(capitalizeFirstAlpha)
    .filter((option, index, list) => list.findIndex((item) => item.trim().toLowerCase() === option.trim().toLowerCase()) === index)
    .slice(0, 8);
}

let view = "dashboard";
let currentTest = null;
let currentIndex = 0;
let lastSummary = null;
let stats = readJson(STORAGE.stats, {});
let bookmarks = new Set(readJson(STORAGE.bookmarks, []));
let testHistory = readJson(STORAGE.tests, []);
let questionEdits = readJson(STORAGE.edits, {});
let originalSnapshots = ensureOriginalSnapshots();
let QUESTION_BANK = createQuestionBank();
let bankSync = {
  status: "idle",
  message: "",
  fetchedAt: 0,
  promise: null
};

const els = {
  headerMetric: document.querySelector("#headerMetric"),
  headerStatus: document.querySelector("#headerStatus"),
  dashboardTab: document.querySelector("#dashboardTab"),
  studyTab: document.querySelector("#studyTab"),
  learnTab: document.querySelector("#learnTab"),
  setupTab: document.querySelector("#setupTab"),
  allThemesTestBtn: document.querySelector("#allThemesTestBtn"),
  bookmarksTab: document.querySelector("#bookmarksTab"),
  showTab: document.querySelector("#showTab"),
  showTabIcon: document.querySelector("#showTabIcon"),
  dashboardView: document.querySelector("#dashboardView"),
  studyView: document.querySelector("#studyView"),
  learnView: document.querySelector("#learnView"),
  setupView: document.querySelector("#setupView"),
  testView: document.querySelector("#testView"),
  summaryView: document.querySelector("#summaryView"),
  bookmarksView: document.querySelector("#bookmarksView"),
  showView: document.querySelector("#showView"),
  dashboardStats: document.querySelector("#dashboardStats"),
  dashboardSuccessRate: document.querySelector("#dashboardSuccessRate"),
  dashboardGraph: document.querySelector("#dashboardGraph"),
  dashboardGraphNote: document.querySelector("#dashboardGraphNote"),
  learnRoot: document.querySelector("#learnRoot"),
  resetShownBtn: document.querySelector("#resetShownBtn"),
  resetShownDialog: document.querySelector("#resetShownDialog"),
  cancelResetShownBtn: document.querySelector("#cancelResetShownBtn"),
  confirmResetShownBtn: document.querySelector("#confirmResetShownBtn"),
  bookmarkTestBtn: document.querySelector("#bookmarkTestBtn"),
  clearBookmarksBtn: document.querySelector("#clearBookmarksBtn"),
  clearBookmarksDialog: document.querySelector("#clearBookmarksDialog"),
  cancelClearBookmarksBtn: document.querySelector("#cancelClearBookmarksBtn"),
  confirmClearBookmarksBtn: document.querySelector("#confirmClearBookmarksBtn"),
  focusOldToggle: document.querySelector("#focusOldToggle"),
  startTestBtn: document.querySelector("#startTestBtn"),
  clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
  setupBankStatus: document.querySelector("#setupBankStatus"),
  bankStats: document.querySelector("#bankStats"),
  questionCount: document.querySelector("#questionCount"),
  progressFill: document.querySelector("#progressFill"),
  sectionBadge: document.querySelector("#sectionBadge"),
  caseBadge: document.querySelector("#caseBadge"),
  bookmarkCurrentBtn: document.querySelector("#bookmarkCurrentBtn"),
  scenarioText: document.querySelector("#scenarioText"),
  questionText: document.querySelector("#questionText"),
  choices: document.querySelector("#choices"),
  caseLink: document.querySelector("#caseLink"),
  ruleLink: document.querySelector("#ruleLink"),
  cancelTestBtn: document.querySelector("#cancelTestBtn"),
  differentQuestionBtn: document.querySelector("#differentQuestionBtn"),
  prevBtn: document.querySelector("#prevBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  summaryRoot: document.querySelector("#summaryRoot"),
  bookmarksRoot: document.querySelector("#bookmarksRoot"),
  bookmarkCount: document.querySelector("#bookmarkCount"),
  sheetLink: document.querySelector("#showView .sheet-link"),
  refreshBankBtn: document.querySelector("#refreshBankBtn"),
  bankSyncStatus: document.querySelector("#bankSyncStatus")
};

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readCachedQuestionBank() {
  const cached = readJson(STORAGE.remoteBank, null);
  if (!cached || !Array.isArray(cached.questions) || cached.questions.length === 0) return null;
  return cached;
}

function hydrateCachedQuestionBank() {
  const cached = readCachedQuestionBank();
  if (!cached) return false;
  const questions = cached.questions.map(normalizeQuestion);
  try {
    validateQuestionBank(questions);
  } catch (error) {
    console.warn(error);
    localStorage.removeItem(STORAGE.remoteBank);
    return false;
  }
  QUESTION_BANK = questions;
  bankSync.fetchedAt = cached.fetchedAt || 0;
  bankSync.status = "ready";
  bankSync.message = `Using saved question bank from ${formatDateTime(cached.fetchedAt)}.`;
  return true;
}

function isMobileDataContext() {
  return window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
}

function shouldAutoFetchQuestionBank() {
  if (sessionStorage.getItem(SESSION.bankFetched) === "true") return false;
  if (!isMobileDataContext()) return true;
  const cached = readCachedQuestionBank();
  return !cached?.fetchedAt || Date.now() - cached.fetchedAt > SIX_MONTHS_MS;
}

function refreshQuestionBank({ force = false } = {}) {
  if (bankSync.promise) return bankSync.promise;
  if (!force && !shouldAutoFetchQuestionBank()) {
    bankSync.status = "ready";
    bankSync.message = "Question bank already up to date.";
    render();
    return Promise.resolve(false);
  }

  sessionStorage.setItem(SESSION.bankFetched, "true");
  bankSync = {
    ...bankSync,
    status: "loading",
    message: "Refreshing question bank from Google Sheets...",
    promise: null
  };
  render();

  const sheetUrl = `${SHEET_CSV_URL}&v=${Date.now()}`;
  bankSync.promise = fetch(sheetUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Sheet fetch failed (${response.status})`);
      return response.text();
    })
    .then((csv) => {
      const rows = csvToObjects(csv);
      const source = rows.map(sheetRowToSource).filter(Boolean);
      const questions = createQuestionBank(source);
      validateQuestionBank(questions);
      const fetchedAt = Date.now();
      QUESTION_BANK = questions;
      writeJson(STORAGE.remoteBank, { fetchedAt, questions });
      bankSync.status = "ready";
      bankSync.fetchedAt = fetchedAt;
      bankSync.message = `Question bank refreshed: ${questions.length} questions.`;
      render();
      return true;
    })
    .catch((error) => {
      bankSync.status = "error";
      bankSync.message = `Could not refresh from Google Sheets. Using saved or built-in questions.`;
      console.warn(error);
      render();
      return false;
    })
    .finally(() => {
      bankSync.promise = null;
      render();
    });

  return bankSync.promise;
}

function csvToObjects(csv) {
  const rows = parseCsv(csv);
  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() || ""])));
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function sheetRowToSource(row) {
  const id = row.id;
  const scenario = row.official_scenario;
  const correct = row.correct_answer;
  const wrongs = [row.wrong_answer_1, row.wrong_answer_2, row.wrong_answer_3].filter(Boolean);
  if (!id || !scenario || !correct || wrongs.length < 1) return null;
  return {
    id,
    section: row.section || "Rules",
    category: row.category || "Rules",
    studyTheme: row.study_theme || studyThemeForCategory(row.category),
    caseId: row.case_id || id,
    caseUrl: normalizeWftdaCaseUrl(row.casebook_url, row.case_id || id, row.casebook_url, row.rule),
    rule: row.rule || "Rulebook",
    ruleUrl: normalizeWftdaRuleUrl(row.rulebook_url, null, row.rule),
    tags: splitTags(row.tags),
    outcomeLabel: row.outcome_label || "Outcome",
    scenario,
    context: row.learning_context,
    prompt: row.question_prompt,
    correct,
    outcome: correct,
    teachingNote: row.correct_rationale,
    rationale: row.correct_rationale,
    keepInMind: row.keep_in_mind,
    distractors: wrongs.map(capitalizeFirstAlpha),
    common: /^yes$/i.test(row.common_scenario || "")
  };
}

function normalizeWftdaCaseUrl(url, caseId, caseAnchor, rule) {
  const candidates = [url, caseAnchor].filter(Boolean);
  for (const candidate of candidates) {
    const text = String(candidate).trim();
    if (/(?:^|\/)document-rules\/|\/0[2-5]_[a-z]+\.html(?:#|$)/i.test(text)) {
      return normalizeWftdaRuleUrl(text, null, rule);
    }

    const current = text.match(/(?:^|\/)casebook\/(0[2-5]_c_[a-z_]+\.html)#(scenario-\d+)$/i);
    if (current) return `${CASEBOOK_ROOT}/${current[1]}#${current[2]}`;

    const compact = text.match(/^(0[2-5]_c_[a-z_]+\.html)#(scenario-\d+)$/i);
    if (compact) return `${CASEBOOK_ROOT}/${compact[1]}#${compact[2]}`;

    const legacy = text.match(/(?:^|\/)document-casebook\/(0[2-5]_c_[a-z_]+)-scenario-(\d+)$/i);
    if (legacy) return `${CASEBOOK_ROOT}/${legacy[1]}.html#scenario-${legacy[2]}`;
  }

  const page = casebookPageForCase(caseId);
  const scenario = candidates.join(" ").match(/scenario-(\d+)/i);
  if (page && scenario) return `${CASEBOOK_ROOT}/${page}#scenario-${scenario[1]}`;
  if (page) return `${CASEBOOK_ROOT}/${page}`;
  return `${CASEBOOK_ROOT}/index.html`;
}

function casebookPageForCase(caseId) {
  const chapter = String(caseId || "").match(/\b(C[2-5])\./i)?.[1]?.toUpperCase();
  return CASEBOOK_PAGE_BY_CHAPTER[chapter] || "";
}

function normalizeWftdaRuleUrl(url, ruleAnchor, rule) {
  const anchor = normalizeRuleAnchor(ruleAnchor) || normalizeRuleAnchor(url) || ruleAnchorForRule(rule);
  const page = rulePageForAnchor(anchor) || rulePageForRule(rule);
  if (page && anchor) return `${SOURCE_ROOT}/${page}#${anchor}`;
  if (page) return `${SOURCE_ROOT}/${page}`;
  return `${SOURCE_ROOT}/index.html`;
}

function normalizeRuleAnchor(value) {
  if (!value) return "";
  const text = String(value).trim();
  const hash = text.match(/#([^#]+)$/)?.[1];
  const raw = hash || text
    .replace(/^https?:\/\/rules\.wftda\.com\//i, "")
    .replace(/^\//, "")
    .replace(/\.html$/i, "");
  if (!raw || raw.includes("/")) return "";
  return RULE_ANCHOR_ALIASES[raw] || raw;
}

function rulePageForAnchor(anchor) {
  if (!anchor) return "";
  if (/^(gameplay-|skater-starting-locations)/.test(anchor)) return "02_gameplay.html";
  if (/^scoring-/.test(anchor)) return "03_scoring.html";
  if (/^(penalties-|protective-gear-in-the-penalty-box|skaters-unable-to-serve-penalties|fouling-out-expulsions)/.test(anchor)) {
    return "04_penalties.html";
  }
  if (/^officiating-/.test(anchor)) return "05_officiating.html";
  return "";
}

function rulePageForRule(rule) {
  const section = String(rule || "").match(/Section\s+([2-5])\./i)?.[1];
  return {
    2: "02_gameplay.html",
    3: "03_scoring.html",
    4: "04_penalties.html",
    5: "05_officiating.html"
  }[section] || "";
}

function ruleAnchorForRule(rule) {
  const section = String(rule || "").match(/Section\s+(\d+(?:\.\d+)*)/i)?.[1];
  const anchors = {
    "2.1": "gameplay-the-track",
    "2.2": "gameplay-positions",
    "2.2.1": "gameplay-positions-jammers",
    "2.2.2": "gameplay-positions-lead-jammer",
    "2.2.4": "gameplay-positions-passing-the-star",
    "2.2.6": "skater-starting-locations",
    "2.3": "gameplay-engagement-zone-and-pack",
    "2.5": "gameplay-passing",
    "3.1": "scoring-earning-points",
    "3.2": "scoring-trips",
    "3.3": "scoring-avoidance",
    "3.4": "scoring-penalized-jammers",
    "4.1.1": "penalties-impact-to-illegal-zone",
    "4.1.2": "penalties-impact-with-illegal-zone",
    "4.1.3": "penalties-other-illegal-contact",
    "4.1.4": "penalties-multiplayer-blocks",
    "4.1.5": "penalties-unsporting-contact",
    "4.2.1": "penalties-structure-illegal-positioning",
    "4.2.2": "penalties-structure-gaining-position",
    "4.2.4": "penalties-structure-other-illegal-procedures",
    "4.3": "penalties-unsporting-conduct",
    "4.4": "penalties-enforcement",
    "4.4.1": "penalties-enforcement-blockers",
    "4.4.2": "penalties-enforcement-jammers",
    "4.4.3": "skaters-unable-to-serve-penalties",
    "4.4.4": "protective-gear-in-the-penalty-box",
    "4.5": "penalties-foul-out-expulsion",
    "5.4": "officiating-assessing-penalties"
  };
  return anchors[section] || "";
}

function validateQuestionBank(questions) {
  const issues = [];
  const ids = new Set();
  if (questions.length < REQUIRED_BANK_QUESTION_COUNT) {
    issues.push(`expected ${REQUIRED_BANK_QUESTION_COUNT} questions, found ${questions.length}`);
  }

  questions.forEach((question, index) => {
    const label = question.caseId || question.id || `question ${index + 1}`;
    const options = [question.correct, ...(question.distractors || [])].filter(Boolean);
    const uniqueOptions = uniqueByText(options);
    if (!question.id) issues.push(`${label}: missing id`);
    if (ids.has(question.id)) issues.push(`${label}: duplicate id`);
    ids.add(question.id);
    if (!question.scenario || /^outcome$/i.test(question.scenario.trim())) issues.push(`${label}: missing official scenario`);
    if (!question.correct) issues.push(`${label}: missing correct answer`);
    if (!String(question.teachingNote || "").trim()) issues.push(`${label}: missing rationale`);
    if (uniqueOptions.length !== options.length) issues.push(`${label}: duplicate answer option`);

    if (isTrueFalsePrompt(question.prompt) || isTrueFalseOptionSet(question.correct, question.distractors)) {
      if (!isTrueFalseOptionSet(question.correct, question.distractors)) {
        issues.push(`${label}: true/false question must have exactly True and False options`);
      }
    } else if (uniqueOptions.length < 4) {
      issues.push(`${label}: needs four unique multiple-choice options`);
    }

    if (!isOfficialSourceUrl(question.caseUrl)) issues.push(`${label}: invalid primary source link`);
    if (!isOfficialRuleUrl(question.ruleUrl)) issues.push(`${label}: invalid rulebook source link`);
  });

  if (issues.length) {
    throw new Error(`Question bank validation failed: ${issues.slice(0, 8).join("; ")}${issues.length > 8 ? `; and ${issues.length - 8} more` : ""}`);
  }
}

function isTrueFalsePrompt(prompt) {
  return /^true\s+or\s+false\b/i.test(String(prompt || "").trim());
}

function isTrueFalseOptionSet(correct, distractors = []) {
  const labels = uniqueByText([correct, ...distractors].filter(Boolean))
    .map((item) => item.trim().toLowerCase());
  return labels.length === 2 && labels.includes("true") && labels.includes("false");
}

function isOfficialCasebookUrl(url) {
  return /^https:\/\/rules\.wftda\.com\/casebook\/0[2-5]_c_[a-z_]+\.html#scenario-\d+$/i.test(String(url || ""));
}

function isOfficialRuleUrl(url) {
  return /^https:\/\/rules\.wftda\.com\/0[2-5]_[a-z]+\.html#[a-z0-9-]+$/i.test(String(url || ""));
}

function isOfficialSourceUrl(url) {
  return isOfficialCasebookUrl(url) || isOfficialRuleUrl(url);
}

function splitTags(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeQuestion(question) {
  return {
    ...question,
    caseUrl: normalizeWftdaCaseUrl(question.caseUrl, question.caseId, question.caseAnchor, question.rule),
    ruleUrl: normalizeWftdaRuleUrl(question.ruleUrl, question.ruleAnchor, question.rule),
    distractors: (question.distractors || []).map(capitalizeFirstAlpha)
  };
}

function capitalizeFirstAlpha(value) {
  return String(value || "").replace(/[A-Za-z]/, (letter) => letter.toUpperCase());
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function overlapCount(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

function uniqueByText(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function adjacentDistractors(question) {
  if (isTrueFalseQuestion(question)) return question.distractors.slice(0, 1);
  if (question.distractors.length >= 3) return question.distractors.slice(0, 3);

  const scored = QUESTION_BANK
    .filter((candidate) => candidate.id !== question.id && candidate.correct !== question.correct)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === question.category) score += 12;
      if (candidate.section === question.section) score += 6;
      if (candidate.rule === question.rule) score += 4;
      score += overlapCount(candidate.tags, question.tags) * 3;
      score += Math.random();
      return { text: candidate.correct, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.text);

  const fallback = question.distractors.filter((item) => item !== question.correct);
  const interleaved = [];
  const max = Math.max(fallback.length, scored.length);
  for (let index = 0; index < max; index += 1) {
    if (fallback[index]) interleaved.push(fallback[index]);
    if (scored[index]) interleaved.push(scored[index]);
  }
  return uniqueByText(interleaved).slice(0, 3);
}

function choicesFor(question) {
  return shuffle(uniqueByText([question.correct, ...adjacentDistractors(question)]));
}

function isTrueFalseQuestion(question) {
  return isTrueFalseOptionSet(question.correct, question.distractors);
}

function getQuestion(id) {
  return QUESTION_BANK.find((question) => question.id === id);
}

function selectedLength() {
  return Number(document.querySelector("input[name='testLength']:checked").value);
}

function selectQuestions(count, focusOld) {
  const commonNeeded = minimumCommonCount(count);
  const commonQuestions = QUESTION_BANK.filter((question) => question.common);
  const selectedCommon = pickQuestions(commonQuestions, Math.min(commonNeeded, commonQuestions.length), focusOld);
  const selectedIds = new Set(selectedCommon.map((question) => question.id));
  const filler = QUESTION_BANK.filter((question) => !selectedIds.has(question.id));
  const selectedFiller = pickQuestions(filler, count - selectedCommon.length, focusOld);
  return shuffle([...selectedCommon, ...selectedFiller]);
}

function minimumCommonCount(total) {
  return Math.ceil(total * COMMON_TEST_SHARE);
}

function pickQuestions(questions, count, focusOld) {
  if (count <= 0) return [];
  if (!focusOld) return sample(questions, count);
  return shuffle(rankQuestions(questions).slice(0, count).map((item) => item.question));
}

function rankQuestions(questions, now = Date.now()) {
  return questions
    .map((question) => {
      const item = stats[question.id] || {};
      const last = item.lastAnswered || item.lastShown || 0;
      const unseenBoost = item.shown ? 0 : 10 ** 15;
      const randomJitter = Math.random() * 100000;
      return { question, score: unseenBoost + (now - last) + randomJitter };
    })
    .sort((a, b) => b.score - a.score);
}

function startTest() {
  if (bankSync.status === "loading") return;
  const count = selectedLength();
  const selected = selectQuestions(count, els.focusOldToggle.checked);
  beginTest(selected);
}

function openNewTestSetup() {
  setView("setup");
}

function startBookmarkedTest() {
  const saved = [...bookmarks].map(getQuestion).filter(Boolean);
  if (saved.length === 0) return;
  beginTest(sample(saved, Math.min(selectedLength(), saved.length)));
}

function beginTest(selected, returnTarget = null) {
  if (selected.length === 0) return;
  selected.forEach(markShown);
  const now = Date.now();
  currentTest = {
    id: `test-${now}`,
    startedAt: now,
    returnTarget,
    questionIds: selected.map((question) => question.id),
    answers: {},
    choiceOrders: Object.fromEntries(selected.map((question) => [question.id, choicesFor(question)]))
  };
  lastSummary = null;
  currentIndex = 0;
  setView("test");
  focusCurrentAnswer();
}

function startFocusedTest(moduleIndex) {
  const module = LEARNING_PATH[moduleIndex];
  if (!module) return;
  const pool = questionsForCategories(module.categories);
  beginTest(pickQuestions(pool, Math.min(10, pool.length), true), {
    view: "learn",
    anchor: `theme-${moduleIndex + 1}`
  });
}

function startStudyPractice(groupKey) {
  const categories = STUDY_PRACTICE_GROUPS[groupKey];
  if (!categories) return;
  const pool = groupKey === "common"
    ? QUESTION_BANK.filter((question) => question.common)
    : questionsForCategories(categories);
  beginTest(pickQuestions(pool, Math.min(10, pool.length), true), {
    view: "study",
    anchor: STUDY_PRACTICE_SECTIONS[groupKey]
  });
}

function answerCurrent(answer) {
  if (!currentTest) return;
  const question = currentQuestion();
  currentTest.answers[question.id] = answer;
  render();
  if (!els.nextBtn.disabled) els.nextBtn.focus({ preventScroll: true });
}

function focusCurrentAnswer() {
  const selected = els.choices.querySelector(".choice-btn.selected");
  const first = els.choices.querySelector(".choice-btn");
  (selected || first)?.focus({ preventScroll: true });
}

function currentQuestion() {
  return getQuestion(currentTest.questionIds[currentIndex]);
}

function markShown(question) {
  const now = Date.now();
  stats[question.id] = {
    ...stats[question.id],
    shown: (stats[question.id]?.shown || 0) + 1,
    lastShown: now
  };
  writeJson(STORAGE.stats, stats);
}

function askDifferentQuestion() {
  if (!currentTest) return;
  const currentId = currentTest.questionIds[currentIndex];
  const candidates = replacementCandidates(currentId);
  if (candidates.length === 0) return;

  const nextQuestion = els.focusOldToggle.checked
    ? rankQuestions(candidates)[0].question
    : sample(candidates, 1)[0];

  const questionIds = [...currentTest.questionIds];
  const answers = { ...currentTest.answers };
  const choiceOrders = { ...currentTest.choiceOrders };

  delete answers[currentId];
  delete choiceOrders[currentId];
  questionIds[currentIndex] = nextQuestion.id;
  choiceOrders[nextQuestion.id] = choicesFor(nextQuestion);
  currentTest = {
    ...currentTest,
    questionIds,
    answers,
    choiceOrders
  };

  markShown(nextQuestion);
  render();
  focusCurrentAnswer();
}

function replacementCandidates(currentId) {
  const total = currentTest.questionIds.length;
  const commonNeeded = minimumCommonCount(total);
  const currentCommonCount = currentTest.questionIds
    .filter((id) => id !== currentId)
    .map(getQuestion)
    .filter((question) => question?.common)
    .length;
  const usedIds = new Set(currentTest.questionIds);
  const candidates = QUESTION_BANK.filter((question) => !usedIds.has(question.id));
  const mustChooseCommon = currentCommonCount < commonNeeded;
  return mustChooseCommon ? candidates.filter((question) => question.common) : candidates;
}

function cancelTest() {
  if (!currentTest) return;
  const returnTarget = currentTest.returnTarget;
  currentTest = null;
  currentIndex = 0;
  if (returnTarget?.view) {
    setView(returnTarget.view, { anchor: returnTarget.anchor });
    return;
  }
  setView("dashboard");
}

function finishTest() {
  if (!currentTest || answeredCount() !== currentTest.questionIds.length) return;
  const now = Date.now();
  const items = currentTest.questionIds.map((id, index) => {
    const question = getQuestion(id);
    const userAnswer = currentTest.answers[id];
    const correct = userAnswer === question.correct;
    stats[id] = {
      ...stats[id],
      answered: (stats[id]?.answered || 0) + 1,
      correct: (stats[id]?.correct || 0) + (correct ? 1 : 0),
      lastAnswered: now
    };
    return { index: index + 1, question, userAnswer, correct };
  });
  writeJson(STORAGE.stats, stats);
  const correctCount = items.filter((item) => item.correct).length;
  const percent = Math.round((correctCount / items.length) * 100);
  lastSummary = {
    id: currentTest.id,
    completedAt: now,
    items,
    correctCount,
    percent,
    passed: percent >= PASS_RATE
  };
  testHistory = [
    ...testHistory,
    {
      id: currentTest.id,
      completedAt: now,
      percent,
      correctCount,
      total: items.length
    }
  ].slice(-24);
  writeJson(STORAGE.tests, testHistory);
  currentTest = null;
  currentIndex = 0;
  setView("summary");
}

function answeredCount() {
  return currentTest ? Object.keys(currentTest.answers).length : 0;
}

function toggleBookmark(id) {
  if (bookmarks.has(id)) bookmarks.delete(id);
  else bookmarks.add(id);
  writeJson(STORAGE.bookmarks, [...bookmarks]);
  render();
}

function clearHistory() {
  stats = {};
  testHistory = [];
  writeJson(STORAGE.stats, stats);
  writeJson(STORAGE.tests, testHistory);
  render();
}

function openResetShownDialog() {
  if (typeof els.resetShownDialog.showModal === "function") {
    els.resetShownDialog.showModal();
    return;
  }
  if (window.confirm("Reset progress? This clears shown history, answered scores, category progress, and the success-rate graph. Bookmarks stay saved.")) {
    resetShownHistory();
  }
}

function closeResetShownDialog() {
  if (els.resetShownDialog.open) els.resetShownDialog.close();
}

function resetShownHistory() {
  stats = {};
  testHistory = [];
  lastSummary = null;
  writeJson(STORAGE.stats, stats);
  writeJson(STORAGE.tests, testHistory);
  closeResetShownDialog();
  render();
}

function openClearBookmarksDialog() {
  if (bookmarks.size === 0) return;
  if (typeof els.clearBookmarksDialog.showModal === "function") {
    els.clearBookmarksDialog.showModal();
    return;
  }
  if (window.confirm("Clear all bookmarks? This removes every saved bookmark without changing progress or scores.")) {
    clearAllBookmarks();
  }
}

function closeClearBookmarksDialog() {
  if (els.clearBookmarksDialog.open) els.clearBookmarksDialog.close();
}

function clearAllBookmarks() {
  bookmarks = new Set();
  writeJson(STORAGE.bookmarks, []);
  closeClearBookmarksDialog();
  render();
}

function setView(next, options = {}) {
  view = next;
  render();
  if (options.anchor) {
    scrollToAnchor(options.anchor);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToAnchor(anchor) {
  const scrollToTarget = () => {
    const target = document.getElementById(anchor);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(scrollToTarget);
    return;
  }
  scrollToTarget();
}

function render() {
  renderTabs();
  renderHeader();
  if (view === "dashboard") renderDashboard();
  if (view === "study") renderStudy();
  if (view === "learn") renderLearn();
  if (view === "setup") renderSetup();
  if (view === "test") renderTest();
  if (view === "summary") renderSummary();
  if (view === "bookmarks") renderBookmarks();
  if (view === "show") renderShow();
}

function renderTabs() {
  document.body.dataset.view = view;
  const panels = ["dashboard", "study", "learn", "setup", "test", "summary", "bookmarks", "show"];
  panels.forEach((name) => {
    els[`${name}View`].hidden = view !== name;
  });
  els.dashboardTab.classList.toggle("active", view === "dashboard");
  els.studyTab.classList.toggle("active", view === "study");
  els.learnTab.classList.toggle("active", view === "learn");
  els.setupTab.classList.toggle("active", view === "setup");
  els.bookmarksTab.classList.toggle("active", view === "bookmarks");
  els.showTab.classList.toggle("active", view === "show");
  renderQuestionsTabIcon();
}

function renderQuestionsTabIcon() {
  els.showTabIcon.innerHTML = `<path d="M5 4h14v16H5V4Zm2 2v3h10V6H7Zm0 5v3h4v-3H7Zm6 0v3h4v-3h-4Zm-6 5v2h4v-2H7Zm6 0v2h4v-2h-4Z"></path>`;
  els.showTab.setAttribute("aria-label", "Questions");
}

function renderHeader() {
  if (view === "test" && currentTest) {
    els.headerMetric.textContent = `${answeredCount()} / ${currentTest.questionIds.length}`;
    els.headerStatus.textContent = "in progress";
  } else if (view === "summary" && lastSummary) {
    els.headerMetric.textContent = `${lastSummary.percent}%`;
    els.headerStatus.textContent = lastSummary.passed ? "passed" : "not passed";
  } else if (view === "bookmarks") {
    els.headerMetric.textContent = `${bookmarks.size} saved`;
    els.headerStatus.textContent = "bookmarks";
  } else if (view === "study") {
    els.headerMetric.textContent = "Start here";
    els.headerStatus.textContent = "study";
  } else if (view === "learn") {
    els.headerMetric.textContent = `${LEARNING_PATH.length} themes`;
    els.headerStatus.textContent = "themes";
  } else if (view === "show") {
    els.headerMetric.textContent = `${QUESTION_BANK.length} questions`;
    els.headerStatus.textContent = "sheet";
  } else {
    els.headerMetric.textContent = `${QUESTION_BANK.length} questions`;
    els.headerStatus.textContent = `${PASS_RATE}% pass`;
  }
}

function renderSetup() {
  const loading = bankSync.status === "loading";
  els.startTestBtn.disabled = loading;
  els.startTestBtn.textContent = loading ? "Refreshing bank..." : "Start test";
  els.setupBankStatus.hidden = !loading;
  els.setupBankStatus.textContent = loading ? bankSync.message : "";
  renderStats(els.bankStats);
}

function renderDashboard() {
  renderStats(els.dashboardStats, true);
  renderSuccessGraph();
}

function renderStudy() {
  els.studyView.querySelectorAll("[data-study-practice]").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    onActivate(button, () => startStudyPractice(button.dataset.studyPractice));
  });
}

function renderLearn() {
  els.learnRoot.innerHTML = LEARNING_PATH.map(learningCard).join("");
  els.learnRoot.querySelectorAll("[data-practice-module]").forEach((button) => {
    onActivate(button, () => startFocusedTest(Number(button.dataset.practiceModule)));
  });
}

function learningCard(module, index) {
  const questions = questionsForCategories(module.categories);
  const commonCount = questions.filter((question) => question.common).length;
  const answered = questions.filter((question) => stats[question.id]?.answered).length;
  return `
    <article id="theme-${index + 1}" class="learning-card">
      <div class="learning-card-main">
        <div class="mini-pack" aria-hidden="true">${miniPack(index + 1)}</div>
        <div>
          <p class="module-level">${escapeHtml(module.level)}</p>
          <h3>${escapeHtml(module.title)}</h3>
          <p>${escapeHtml(module.description)}</p>
          <div class="tag-row">${module.focus.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>
        </div>
      </div>
      <div class="learning-card-side">
        <strong>${answered}/${questions.length}</strong>
        <span>answered</span>
        <small>${commonCount} common scenarios</small>
        <button class="ghost-btn" type="button" data-practice-module="${index}">Practice 10</button>
      </div>
    </article>
  `;
}

function miniPack(count) {
  const spacing = 13;
  const start = 60 - ((count - 1) * spacing) / 2;
  return `
    <svg viewBox="0 0 120 56" role="img">
      <path class="mini-track" d="M28 10h64a18 18 0 0 1 0 36H28a18 18 0 0 1 0-36Z"></path>
      <path class="mini-line" d="M31 28h58"></path>
      ${Array.from({ length: count }, (_, index) => `<circle class="team-dot white" cx="${start + index * spacing}" cy="28" r="5"></circle>`).join("")}
    </svg>
  `;
}

function questionsForCategories(categories) {
  const moduleTitle = LEARNING_PATH.find((module) => module.categories === categories)?.title;
  return QUESTION_BANK.filter((question) => (
    categories.includes(question.category) || question.studyTheme === moduleTitle
  ));
}

function renderStats(root, compact = false) {
  const shown = QUESTION_BANK.filter((question) => stats[question.id]?.shown).length;
  const answered = QUESTION_BANK.filter((question) => stats[question.id]?.answered).length;
  const labels = compact
    ? ["Bank", "Shown", "Answered", "Bookmarked"]
    : ["questions in bank", "shown at least once", "answered at least once", "bookmarked"];
  root.innerHTML = [
    statTile(QUESTION_BANK.length, labels[0]),
    statTile(shown, labels[1]),
    statTile(answered, labels[2]),
    statTile(bookmarks.size, labels[3])
  ].join("");
}

function statTile(value, label) {
  return `<div class="stat-tile"><strong>${value}</strong><span>${label}</span></div>`;
}

function answerTotals() {
  return Object.values(stats).reduce((totals, item) => {
    totals.answered += item.answered || 0;
    totals.correct += item.correct || 0;
    return totals;
  }, { answered: 0, correct: 0 });
}

function renderSuccessGraph() {
  const totals = answerTotals();
  const overall = totals.answered ? Math.round((totals.correct / totals.answered) * 100) : null;
  const series = testHistory.length > 0
    ? testHistory.map((item) => ({ value: item.percent, label: formatAttemptLabel(item.completedAt) }))
    : overall !== null
      ? [{ value: overall, label: "All" }]
      : [];

  els.dashboardSuccessRate.textContent = overall === null ? "--" : `${overall}%`;

  if (series.length === 0) {
    els.dashboardGraph.innerHTML = `
      <div class="graph-empty">
        <span class="graph-zero">0%</span>
        <span class="graph-pass">80% pass line</span>
      </div>
    `;
    els.dashboardGraphNote.textContent = "Complete a test to start tracking results.";
    return;
  }

  const width = Math.max(720, series.length * 112);
  const height = 190;
  const pad = 24;
  const usableWidth = width - pad * 2;
  const usableHeight = height - pad * 2;
  const points = series.map((item, index) => {
    const x = pad + (series.length === 1 ? usableWidth / 2 : (usableWidth / (series.length - 1)) * index);
    const y = pad + ((100 - item.value) / 100) * usableHeight;
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const areaPath = points.length > 1
    ? `${linePath} L ${points.at(-1).x.toFixed(1)} ${height - pad} L ${points[0].x.toFixed(1)} ${height - pad} Z`
    : "";
  const passY = pad + ((100 - PASS_RATE) / 100) * usableHeight;

  els.dashboardGraph.innerHTML = `
    <div class="graph-frame line-frame" style="--graph-width:${width}px">
      <svg class="line-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Questionnaire success rate">
        <line class="pass-line-svg" x1="${pad}" x2="${width - pad}" y1="${passY.toFixed(1)}" y2="${passY.toFixed(1)}"></line>
        <text class="pass-label-svg" x="${width - pad}" y="${Math.max(12, passY - 6).toFixed(1)}" text-anchor="end">${PASS_RATE}%</text>
        ${areaPath ? `<path class="success-area" d="${areaPath}"></path>` : ""}
        <path class="success-line" d="${linePath}"></path>
        ${points.map((point) => `<circle class="success-point" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.2"><title>${escapeHtml(point.label)}: ${point.value}%</title></circle>`).join("")}
      </svg>
      <div class="graph-labels">
        ${points.map((point) => `<span>${escapeHtml(point.label)}</span>`).join("")}
      </div>
    </div>
  `;
  els.dashboardGraphNote.textContent = testHistory.length > 0
    ? `Showing ${testHistory.length} completed ${testHistory.length === 1 ? "test" : "tests"}.`
    : `${totals.correct} of ${totals.answered} answered questions correct.`;
}

function formatAttemptLabel(timestamp) {
  if (!timestamp) return "Attempt";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function formatDateTime(timestamp) {
  if (!timestamp) return "never";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(timestamp));
}

function questionCaseHref(question) {
  return question.caseUrl || `${CASE_ROOT}${question.caseAnchor}`;
}

function questionRuleHref(question) {
  return question.ruleUrl || `${RULE_ROOT}${question.ruleAnchor}`;
}

function renderTest() {
  if (!currentTest) return;
  const question = currentQuestion();
  const answer = currentTest.answers[question.id];
  const total = currentTest.questionIds.length;
  els.questionCount.textContent = `Question ${currentIndex + 1} of ${total}`;
  els.progressFill.style.width = `${((currentIndex + 1) / total) * 100}%`;
  els.sectionBadge.textContent = question.section;
  els.caseBadge.textContent = `${question.caseId} / ${question.kind}`;
  els.scenarioText.textContent = question.scenario;
  els.questionText.textContent = question.prompt;
  els.caseLink.href = questionCaseHref(question);
  els.caseLink.textContent = question.caseId;
  els.ruleLink.href = questionRuleHref(question);
  els.ruleLink.textContent = question.rule;
  const currentBookmarked = bookmarks.has(question.id);
  els.bookmarkCurrentBtn.innerHTML = bookmarkIcon(currentBookmarked);
  els.bookmarkCurrentBtn.setAttribute("aria-label", currentBookmarked ? "Remove bookmark" : "Bookmark question");
  els.bookmarkCurrentBtn.title = currentBookmarked ? "Remove bookmark" : "Bookmark question";
  els.bookmarkCurrentBtn.classList.toggle("active", currentBookmarked);
  els.choices.innerHTML = "";
  currentTest.choiceOrders[question.id].forEach((choice) => {
    const option = document.createElement("article");
    option.className = "answer-option";
    option.classList.toggle("selected", answer === choice);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-btn";
    button.textContent = choice;
    button.classList.toggle("selected", answer === choice);
    button.setAttribute("aria-pressed", answer === choice ? "true" : "false");
    button.addEventListener("click", () => answerCurrent(choice));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      answerCurrent(choice);
    });
    option.append(button);

    els.choices.append(option);
  });
  els.prevBtn.disabled = currentIndex === 0;
  els.differentQuestionBtn.disabled = replacementCandidates(question.id).length === 0;
  const isLastQuestion = currentIndex === total - 1;
  const canMoveNext = Boolean(answer);
  els.nextBtn.classList.toggle("icon-btn", !isLastQuestion);
  els.nextBtn.classList.toggle("submit-btn", isLastQuestion);
  els.nextBtn.classList.toggle("ready", canMoveNext);
  els.nextBtn.textContent = isLastQuestion ? "Submit test" : "›";
  els.nextBtn.setAttribute("aria-label", isLastQuestion ? "Submit test" : "Next question");
  els.nextBtn.title = isLastQuestion ? "Submit test" : "Next question";
  els.nextBtn.disabled = isLastQuestion ? answeredCount() !== total : !canMoveNext;
}

function categoryStats(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.question.category;
    const current = map.get(key) || { category: key, correct: 0, total: 0 };
    current.total += 1;
    current.correct += item.correct ? 1 : 0;
    map.set(key, current);
  });
  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
}

function renderSummary() {
  if (!lastSummary) {
    els.summaryRoot.innerHTML = `<p class="empty-state">Take a test to see a full summary here.</p>`;
    return;
  }
  const resultClass = lastSummary.passed ? "pass" : "fail";
  const categoryHtml = categoryStats(lastSummary.items).map((stat) => {
    const pct = Math.round((stat.correct / stat.total) * 100);
    return `<div class="category-stat"><strong>${stat.category}</strong><span>${stat.correct}/${stat.total} correct (${pct}%)</span></div>`;
  }).join("");
  els.summaryRoot.innerHTML = `
    <div class="summary-hero">
      <div class="result-card ${resultClass}">
        <h2>${lastSummary.passed ? "Passed" : "Not passed"}: ${lastSummary.percent}%</h2>
        <p>${lastSummary.correctCount} of ${lastSummary.items.length} correct. Passing requires ${PASS_RATE}%.</p>
      </div>
      <div class="category-grid">${categoryHtml}</div>
    </div>
    <div class="summary-actions">
      <button class="primary-btn" type="button" data-action="new-test">New test</button>
      <button class="ghost-btn" type="button" data-action="bookmarks">Bookmarks</button>
    </div>
    <div class="question-list">${lastSummary.items.map(summaryCard).join("")}</div>
  `;
  onActivate(els.summaryRoot.querySelector("[data-action='new-test']"), () => setView("setup"));
  onActivate(els.summaryRoot.querySelector("[data-action='bookmarks']"), () => setView("bookmarks"));
  els.summaryRoot.querySelectorAll("[data-bookmark]").forEach((button) => {
    onActivate(button, () => toggleBookmark(button.dataset.bookmark));
  });
}

function summaryCard(item) {
  const { question } = item;
  const result = item.correct ? "correct" : "incorrect";
  return `
    <article class="question-card ${result}">
      <div class="question-card-head">
        <h3>${item.index}. ${escapeHtml(question.prompt)}</h3>
        ${bookmarkButton(question.id)}
      </div>
      ${questionScenarioBlock(question)}
      ${tagRow(question)}
      <div class="answer-line user ${item.correct ? "good" : "bad"}"><strong>Your answer</strong><span>${escapeHtml(item.userAnswer)}</span></div>
      <div class="answer-line"><strong>Correct</strong><span>${escapeHtml(question.correct)}</span></div>
      <details class="summary-rationale">
        <summary>Rationale</summary>
        <p>${escapeHtml(question.teachingNote)}</p>
      </details>
      <div class="source-row compact"><a href="${questionCaseHref(question)}" target="_blank" rel="noreferrer">${question.caseId}</a><a href="${questionRuleHref(question)}" target="_blank" rel="noreferrer">${question.rule}</a></div>
    </article>
  `;
}

function renderBookmarks() {
  const saved = [...bookmarks].map(getQuestion).filter(Boolean);
  els.bookmarkCount.textContent = `${saved.length} saved`;
  els.clearBookmarksBtn.disabled = saved.length === 0;
  els.bookmarkTestBtn.disabled = saved.length === 0;
  if (saved.length === 0) {
    els.bookmarksRoot.innerHTML = `
      <div class="empty-state bookmark-empty">
        <span class="empty-bookmark-icon">${bookmarkIcon(false)}</span>
        <p>No bookmarked questions yet. Use the bookmark icon during a test or from the summary page.</p>
      </div>
    `;
    return;
  }
  els.bookmarksRoot.innerHTML = `<div class="question-list">${saved.map(bookmarkCard).join("")}</div>`;
  els.bookmarksRoot.querySelectorAll("[data-bookmark]").forEach((button) => {
    onActivate(button, () => toggleBookmark(button.dataset.bookmark));
  });
}

function bookmarkCard(question) {
  return `
    <article class="question-card">
      <div class="question-card-head">
        <h3>${escapeHtml(question.prompt)}</h3>
        ${bookmarkButton(question.id)}
      </div>
      ${questionScenarioBlock(question)}
      ${tagRow(question)}
      <details class="summary-rationale bookmark-answer">
        <summary>Answer and rationale</summary>
        <div class="answer-line"><strong>Correct</strong><span>${escapeHtml(question.correct)}</span></div>
        <p>${escapeHtml(question.teachingNote)}</p>
      </details>
      <div class="source-row compact"><a href="${questionCaseHref(question)}" target="_blank" rel="noreferrer">${question.caseId}</a><a href="${questionRuleHref(question)}" target="_blank" rel="noreferrer">${question.rule}</a></div>
    </article>
  `;
}

function officialCase(id) {
  return (window.OFFICIAL_CASES || []).find((item) => item.id === id);
}

function renderShow() {
  if (!els.showView || view !== "show") return;
  const loading = bankSync.status === "loading";
  els.refreshBankBtn.disabled = loading;
  els.refreshBankBtn.querySelector("span").textContent = loading ? "Refreshing..." : "Refresh question bank";
  els.bankSyncStatus.textContent = bankSync.message || "The site checks the published Sheet at most once per browser session. Mobile browsers only auto-check when the saved bank is older than 6 months.";
  els.bankSyncStatus.classList.toggle("is-error", bankSync.status === "error");
}

function ensureOriginalSnapshots() {
  const stored = readJson(STORAGE.originals, {});
  let changed = false;
  (window.OFFICIAL_CASES || []).forEach((item) => {
    if (stored[item.id]) return;
    stored[item.id] = originalFromOfficial(item);
    changed = true;
  });
  if (changed) writeJson(STORAGE.originals, stored);
  return stored;
}

function originalFromOfficial(item) {
  return {
    scenario: item.scenario,
    context: defaultContextNote(item),
    prompt: defaultQuestionPrompt(item),
    correct: item.outcome,
    teachingNote: defaultTeachingNote(item)
  };
}

function originalSnapshot(id) {
  const official = officialCase(id);
  if (official && (!originalSnapshots[id] || !originalSnapshots[id].scenario || !originalSnapshots[id].context)) {
    originalSnapshots[id] = originalFromOfficial(official);
    writeJson(STORAGE.originals, originalSnapshots);
  }
  return originalSnapshots[id] || {
    scenario: "",
    context: "",
    prompt: "",
    correct: "",
    teachingNote: "The original version is unavailable."
  };
}


function bookmarkButton(id) {
  const active = bookmarks.has(id);
  return `<button class="bookmark-btn ${active ? "active" : ""}" type="button" data-bookmark="${id}" aria-label="${active ? "Remove bookmark" : "Bookmark question"}" title="${active ? "Remove bookmark" : "Bookmark question"}">${bookmarkIcon(active)}</button>`;
}

function questionScenarioBlock(question) {
  return `
    <div class="card-scenario">
      <strong>Scenario</strong>
      <p>${escapeHtml(question.scenario)}</p>
      ${question.context ? `<small>${escapeHtml(question.context)}</small>` : ""}
    </div>
  `;
}

function bookmarkIcon(active) {
  return `
    <svg class="bookmark-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h10v15l-5-3.3-5 3.3v-15Z"></path>
      ${active ? "" : `<path class="bookmark-cut" d="M9 6.8h6v8.2l-3-1.9-3 1.9V6.8Z"></path>`}
    </svg>
  `;
}

function tagRow(question) {
  const tags = [question.category, ...question.tags];
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onActivate(element, handler) {
  element.addEventListener("click", handler);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handler(event);
  });
}

onActivate(els.dashboardTab, () => setView("dashboard"));
onActivate(els.bookmarksTab, () => setView("bookmarks"));
onActivate(els.studyTab, () => setView("study"));
onActivate(els.learnTab, () => setView("learn"));
onActivate(els.setupTab, () => setView("setup"));
onActivate(els.allThemesTestBtn, openNewTestSetup);
onActivate(els.showTab, () => setView("show"));
onActivate(els.resetShownBtn, openResetShownDialog);
onActivate(els.cancelResetShownBtn, closeResetShownDialog);
onActivate(els.confirmResetShownBtn, resetShownHistory);
onActivate(els.bookmarkTestBtn, startBookmarkedTest);
onActivate(els.clearBookmarksBtn, openClearBookmarksDialog);
onActivate(els.cancelClearBookmarksBtn, closeClearBookmarksDialog);
onActivate(els.confirmClearBookmarksBtn, clearAllBookmarks);
onActivate(els.refreshBankBtn, () => refreshQuestionBank({ force: true }));
onActivate(els.startTestBtn, startTest);
onActivate(els.clearHistoryBtn, clearHistory);
onActivate(els.bookmarkCurrentBtn, () => currentTest && toggleBookmark(currentQuestion().id));
onActivate(els.cancelTestBtn, cancelTest);
onActivate(els.differentQuestionBtn, askDifferentQuestion);
onActivate(els.prevBtn, () => {
  currentIndex = Math.max(0, currentIndex - 1);
  render();
  focusCurrentAnswer();
});
onActivate(els.nextBtn, () => {
  if (els.nextBtn.disabled) return;
  if (currentIndex === currentTest.questionIds.length - 1) {
    finishTest();
    return;
  }
  currentIndex += 1;
  render();
  focusCurrentAnswer();
});

if (QUESTION_BANK.length !== 150) {
  console.warn(`Expected 150 questions, found ${QUESTION_BANK.length}`);
}

hydrateCachedQuestionBank();
render();
refreshQuestionBank();
