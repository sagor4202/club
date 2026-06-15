import { useEffect, useRef } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { isKnownTranslatedText, translateKnownText } from "../i18n/translations";

const SOURCE_LANG = "en";
const TRANSLATE_ATTRS = ["placeholder", "title", "aria-label", "alt"];
const MAX_CHUNK_LENGTH = 180;
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "SVG",
  "PATH",
  "CODE",
  "PRE",
]);

const languageCodeMap = {
  en: "en",
  de: "de",
  ro: "ro",
  es: "es",
  zh: "zh-CN",
  hu: "hu",
  "es-DO": "es",
  it: "it",
};

const googleLanguageCodeMap = {
  en: "en",
  de: "de",
  ro: "ro",
  es: "es",
  zh: "zh-CN",
  hu: "hu",
  "es-DO": "es",
  it: "it",
};

const textSourceMap = new WeakMap();
const textLangMap = new WeakMap();
const attrSourceMap = new WeakMap();
const attrLangMap = new WeakMap();
const translationCache = new Map();

function shouldSkipElement(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
  if (element.closest("[data-no-translate]")) return true;
  if (element.matches("[contenteditable='true'], .material-symbols-outlined")) return true;
  if (SKIP_TAGS.has(element.tagName)) return true;
  return false;
}

function hasMeaningfulText(text) {
  return /\S/.test(text);
}

function restoreTextNode(node) {
  const source = textSourceMap.get(node);
  if (typeof source === "string") {
    node.nodeValue = source;
    textLangMap.set(node, SOURCE_LANG);
  }
}

function restoreAttributes(element) {
  const sourceAttrs = attrSourceMap.get(element);
  if (!sourceAttrs) return;

  TRANSLATE_ATTRS.forEach((attr) => {
    if (Object.prototype.hasOwnProperty.call(sourceAttrs, attr)) {
      const value = sourceAttrs[attr];
      if (value == null) {
        element.removeAttribute(attr);
      } else {
        element.setAttribute(attr, value);
      }
      attrLangMap.set(element, SOURCE_LANG);
    }
  });
}

function rememberAttributes(element) {
  if (!attrSourceMap.has(element)) {
    attrSourceMap.set(element, {});
  }

  const sourceAttrs = attrSourceMap.get(element);
  TRANSLATE_ATTRS.forEach((attr) => {
    if (!Object.prototype.hasOwnProperty.call(sourceAttrs, attr)) {
      sourceAttrs[attr] = element.getAttribute(attr);
    }
  });
}

async function translateString(source, targetLanguage) {
  if (targetLanguage === SOURCE_LANG) return source;

  const knownTranslation = translateKnownText(targetLanguage, source);
  if (knownTranslation) return knownTranslation;

  const cacheKey = `${targetLanguage}::${source}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const googleLanguage = googleLanguageCodeMap[targetLanguage] || targetLanguage;
  const googleUrl =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=${SOURCE_LANG}&tl=${googleLanguage}&dt=t&q=${encodeURIComponent(source)}`;

  try {
    const response = await fetch(googleUrl);
    if (!response.ok) throw new Error(`Google translation failed: ${response.status}`);

    const data = await response.json();
    const translated = Array.isArray(data?.[0])
      ? data[0].map((item) => item?.[0] || "").join("")
      : "";
    if (translated) {
      translationCache.set(cacheKey, translated);
      return translated;
    }
  } catch {
    // Fall through to the secondary provider.
  }

  const apiLanguage = languageCodeMap[targetLanguage] || targetLanguage;
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(source)}` +
    `&langpair=${SOURCE_LANG}|${apiLanguage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translation failed: ${response.status}`);

    const data = await response.json();
    const translated = data?.responseData?.translatedText || source;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return source;
  }
}

function splitIntoChunks(source, maxLength = MAX_CHUNK_LENGTH) {
  const normalized = String(source || "").trim();
  if (!normalized) return [];
  if (normalized.length <= maxLength) return [normalized];

  const sentenceMatches =
    normalized.match(/[^.!?。！？]+[.!?。！？]*/g) || [normalized];
  const chunks = [];
  let buffer = "";

  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) chunks.push(trimmed);
    buffer = "";
  };

  const addWordFallback = (text) => {
    const words = text.split(/\s+/);
    let wordBuffer = "";

    words.forEach((word) => {
      if (!word) return;
      const candidate = wordBuffer ? `${wordBuffer} ${word}` : word;
      if (candidate.length > maxLength) {
        if (wordBuffer) chunks.push(wordBuffer);
        wordBuffer = word;
        return;
      }
      wordBuffer = candidate;
    });

    if (wordBuffer) chunks.push(wordBuffer);
  };

  sentenceMatches.forEach((sentence) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) return;

    if (trimmedSentence.length > maxLength) {
      pushBuffer();
      addWordFallback(trimmedSentence);
      return;
    }

    const candidate = buffer ? `${buffer} ${trimmedSentence}` : trimmedSentence;
    if (candidate.length > maxLength) {
      pushBuffer();
      buffer = trimmedSentence;
    } else {
      buffer = candidate;
    }
  });

  pushBuffer();
  return chunks;
}

async function translateParagraph(source, targetLanguage) {
  const chunks = splitIntoChunks(source);
  if (!chunks.length) return source;
  if (chunks.length === 1) {
    return translateString(chunks[0], targetLanguage);
  }

  const translatedChunks = await Promise.all(
    chunks.map((chunk) => translateString(chunk, targetLanguage))
  );
  return translatedChunks.join(" ");
}

async function translateText(source, targetLanguage) {
  if (targetLanguage === SOURCE_LANG) return source;

  const cacheKey = `__text__::${targetLanguage}::${source}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const segments = String(source).split(/(\n+)/);
  const translatedSegments = [];

  for (const segment of segments) {
    if (!segment) continue;
    if (/^\n+$/.test(segment)) {
      translatedSegments.push(segment);
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    translatedSegments.push(await translateParagraph(segment, targetLanguage));
  }

  const translated = translatedSegments.join("");
  translationCache.set(cacheKey, translated);
  return translated;
}

function collectTextNodes(root) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      if (!hasMeaningfulText(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    nodes.push(current);
    current = walker.nextNode();
  }
  return nodes;
}

function collectElements(root) {
  const elements = [];
  if (root?.nodeType === Node.ELEMENT_NODE) {
    elements.push(root);
  }
  if (!root.querySelectorAll) return elements;
  root.querySelectorAll("*").forEach((el) => elements.push(el));
  return elements;
}

async function translateRoot(root, targetLanguage) {
  if (!root || targetLanguage === SOURCE_LANG) {
    collectTextNodes(root).forEach(restoreTextNode);
    collectElements(root).forEach(restoreAttributes);
    return;
  }

  const textNodes = collectTextNodes(root);
  const elements = collectElements(root);

  const uniqueTexts = new Map();
  textNodes.forEach((node) => {
    const currentText = String(node.nodeValue || "");
    const trimmedCurrent = currentText.trim();
    if (!trimmedCurrent) return;

    if (
      targetLanguage !== SOURCE_LANG &&
      isKnownTranslatedText(trimmedCurrent, targetLanguage)
    ) {
      textLangMap.set(node, targetLanguage);
      return;
    }

    if (!textSourceMap.has(node)) {
      textSourceMap.set(node, currentText);
    }

    const source = textSourceMap.get(node);
    const trimmed = String(source || "").trim();
    if (!trimmed) return;
    if (!uniqueTexts.has(trimmed)) uniqueTexts.set(trimmed, []);
    uniqueTexts.get(trimmed).push(node);
  });

  const attrRequests = [];
  elements.forEach((element) => {
    if (shouldSkipElement(element)) return;
    rememberAttributes(element);

    TRANSLATE_ATTRS.forEach((attr) => {
      const original = attrSourceMap.get(element)?.[attr];
      if (!original || !hasMeaningfulText(original)) return;
      attrRequests.push({ element, attr, source: original });
    });
  });

  await Promise.all(
    Array.from(uniqueTexts.entries()).map(async ([source, nodes]) => {
      const translated = await translateText(source, targetLanguage);
    nodes.forEach((node) => {
      const original = textSourceMap.get(node) || source;
      const current = String(node.nodeValue || "");
      const match = current.match(/^(\s*)(.*?)(\s*)$/s);
      const nextValue = !match ? translated : `${match[1]}${translated}${match[3]}`;
      if (current === nextValue || current.trim() === translated.trim()) {
        textLangMap.set(node, targetLanguage);
        return;
      }
      node.nodeValue = nextValue;
      textSourceMap.set(node, original);
      textLangMap.set(node, targetLanguage);
    });
  })
  );

  await Promise.all(
    attrRequests.map(async ({ element, attr, source }) => {
      const translated = await translateText(source, targetLanguage);
      if ((element.getAttribute(attr) || "").trim() === translated.trim()) {
        attrLangMap.set(element, targetLanguage);
        return;
      }
      element.setAttribute(attr, translated);
      attrLangMap.set(element, targetLanguage);
    })
  );
}

export function AutoTranslator() {
  const { language } = useLanguage();
  const observerRef = useRef(null);
  const flushingRef = useRef(false);
  const pendingRootsRef = useRef(new Set());
  const timerRef = useRef(null);

  useEffect(() => {
    const flush = async () => {
      if (flushingRef.current) return;
      flushingRef.current = true;
      try {
        const roots = Array.from(pendingRootsRef.current);
        pendingRootsRef.current.clear();
        for (const root of roots) {
          // eslint-disable-next-line no-await-in-loop
          await translateRoot(root, language);
        }
      } finally {
        flushingRef.current = false;
      }
    };

    const scheduleFlush = (root) => {
      if (!root) return;
      pendingRootsRef.current.add(root);
      if (timerRef.current) return;
      timerRef.current = window.setTimeout(async () => {
        timerRef.current = null;
        await flush();
      }, 80);
    };

    observerRef.current?.disconnect?.();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          scheduleFlush(mutation.target.parentElement || document.body);
        }
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              scheduleFlush(node.parentElement || document.body);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              scheduleFlush(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    observerRef.current = observer;

    scheduleFlush(document.body);

    return () => {
      observer.disconnect();
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      flushingRef.current = false;
      pendingRootsRef.current.clear();
    };
  }, [language]);

  return null;
}
