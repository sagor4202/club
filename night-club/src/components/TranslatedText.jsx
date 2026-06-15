import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { translateKnownText } from "../i18n/translations";

const SOURCE_LANG = "en";
const MAX_CHUNK_LENGTH = 180;
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

const cache = new Map();

function splitIntoChunks(source, maxLength = MAX_CHUNK_LENGTH) {
  const normalized = String(source || "").trim();
  if (!normalized) return [];
  if (normalized.length <= maxLength) return [normalized];

  const sentenceMatches =
    normalized.match(/[^.!?\u3002\uFF01\uFF1F]+[.!?\u3002\uFF01\uFF1F]*/g) || [normalized];
  const chunks = [];
  let buffer = "";

  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) chunks.push(trimmed);
    buffer = "";
  };

  sentenceMatches.forEach((sentence) => {
    const trimmed = sentence.trim();
    if (!trimmed) return;
    const candidate = buffer ? `${buffer} ${trimmed}` : trimmed;
    if (candidate.length > maxLength) {
      pushBuffer();
      buffer = trimmed;
    } else {
      buffer = candidate;
    }
  });

  pushBuffer();
  return chunks;
}

async function translateChunk(source, language) {
  const knownTranslation = translateKnownText(language, source);
  if (knownTranslation) return knownTranslation;

  const cacheKey = `${language}::${source}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const googleLanguage = googleLanguageCodeMap[language] || language;
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
      cache.set(cacheKey, translated);
      return translated;
    }
  } catch {
    // Fall through to the secondary provider.
  }

  const apiLanguage = languageCodeMap[language] || language;
  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(source)}` +
    `&langpair=${SOURCE_LANG}|${apiLanguage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translation failed: ${response.status}`);
    const data = await response.json();
    const translated = data?.responseData?.translatedText || source;
    cache.set(cacheKey, translated);
    return translated;
  } catch {
    return source;
  }
}

async function translateText(source, language) {
  if (language === SOURCE_LANG) return source;

  const cacheKey = `text::${language}::${source}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const segments = String(source).split(/(\n+)/);
  const translatedSegments = [];

  for (const segment of segments) {
    if (!segment) continue;
    if (/^\n+$/.test(segment)) {
      translatedSegments.push(segment);
      continue;
    }

    const chunks = splitIntoChunks(segment);
    // eslint-disable-next-line no-await-in-loop
    const translatedChunks = await Promise.all(
      chunks.map((chunk) => translateChunk(chunk, language))
    );
    translatedSegments.push(translatedChunks.join(" "));
  }

  const translated = translatedSegments.join("");
  cache.set(cacheKey, translated);
  return translated;
}

export default function TranslatedText({ children }) {
  const { language } = useLanguage();
  const source = String(children ?? "");
  const [text, setText] = useState(source);

  useEffect(() => {
    let cancelled = false;

    setText(language === SOURCE_LANG ? source : translateKnownText(language, source) || source);

    translateText(source, language).then((translated) => {
      if (!cancelled) setText(translated);
    });

    return () => {
      cancelled = true;
    };
  }, [language, source]);

  return <span data-no-translate>{text}</span>;
}
