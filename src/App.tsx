/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Download,
  Volume2,
  Mic,
  Square,
  Upload,
  Wand2,
  Sliders,
  Plus,
  Trash2,
  Search,
  Globe,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  FileAudio,
  Code2,
  UserPlus,
  RefreshCw,
  BookOpen,
} from "lucide-react";

export interface CartesiaVoice {
  id: string;
  name: string;
  gender: string;
  language: string;
  country: string;
  description: string;
  featured: boolean;
  tags: string[];
  locales: string[];
  rank?: number;
  cloneHandle?: string;
  sampleTranscript?: string;
}

export type SonicEmotion =
  | "neutral"
  | "happy"
  | "excited"
  | "enthusiastic"
  | "curious"
  | "surprised"
  | "calm"
  | "content"
  | "sad"
  | "angry";

interface PronunciationRule {
  id: string;
  word: string;
  replacement: string;
}

interface GeneratedTake {
  id: string;
  title: string;
  mode: string;
  voiceLabel: string;
  voiceId: string;
  styleNote: string;
  scriptPreview: string;
  audioDataUrl: string;
  createdAt: string;
  durationEst: string;
  modelUsed: string;
  ttfbMs: number;
}

interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  emotion: SonicEmotion;
}

// Initial Featured & Bangladeshi Voices (before all 1,022 load from /api/cartesia/voices)
const STARTER_VOICES: CartesiaVoice[] = [
  {
    id: "59ba7dee-8f9a-432f-a6c0-ffb33666b654",
    name: "Pooja - Everyday Assistant",
    gender: "feminine",
    language: "bn",
    country: "bd",
    description:
      "Soft-spoken adult female Bangladeshi voice for casual conversations, storytelling, and natural dialogue.",
    featured: true,
    tags: ["Conversational", "Entertainment"],
    locales: ["bn-BD"],
    rank: 1,
  },
  {
    id: "2ba861ea-7cdc-43d1-8608-4045b5a41de5",
    name: "Rubel - City Guide",
    gender: "masculine",
    language: "bn",
    country: "bd",
    description:
      "Casual adult male Bangladeshi voice for everyday conversations and relatable dialogue.",
    featured: true,
    tags: ["Conversational"],
    locales: ["bn-BD"],
    rank: 2,
  },
  {
    id: "48b9e1de-e2fa-4914-8b32-31c437813548",
    name: "Ananya - Paced Helper",
    gender: "feminine",
    language: "bn",
    country: "bd",
    description:
      "Clear steady Bengali tone with a paced delivery. Perfect for a smooth customer service experience.",
    featured: true,
    tags: ["Customer Support"],
    locales: ["bn-BD"],
    rank: 3,
  },
  {
    id: "314be1d2-3d14-468d-be40-08a1af7df49d",
    name: "Kian - Thoughtful Narrator",
    gender: "masculine",
    language: "bn",
    country: "bd",
    description:
      "Gentle and measured Bengali cadence providing a thoughtful narrative experience for documentaries and education.",
    featured: true,
    tags: ["Storytelling"],
    locales: ["bn-BD"],
    rank: 4,
  },
  {
    id: "ddf9ec71-3337-4a8a-a318-9a42f72433e2",
    name: "Rupam - Detailed Analyst",
    gender: "masculine",
    language: "bn",
    country: "bd",
    description:
      "Detailed and precise Bengali delivery, excellent for analytical content requiring clear communication.",
    featured: true,
    tags: ["Conversational"],
    locales: ["bn-BD"],
    rank: 5,
  },
  {
    id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
    name: "Skylar - Friendly Guide",
    gender: "feminine",
    language: "en",
    country: "us",
    description:
      "Cartesia flagship warm and unhurried conversational voice agent.",
    featured: true,
    tags: ["Conversational", "Agent"],
    locales: ["en-US"],
    rank: 6,
  },
  {
    id: "47c38ca4-5f35-497b-b1a3-415245fb35e1",
    name: "Daniel - Modern Assistant",
    gender: "masculine",
    language: "en",
    country: "us",
    description:
      "Crisp, modern American male assistant for advertising, brand films, and live agents.",
    featured: true,
    tags: ["Conversational", "Advertising"],
    locales: ["en-US"],
    rank: 7,
  },
  {
    id: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
    name: "Katie - Customer Care Specialist",
    gender: "feminine",
    language: "en",
    country: "us",
    description:
      "Empathetic, ultra-natural customer support and cross-lingual localization voice.",
    featured: true,
    tags: ["Customer Support"],
    locales: ["en-US"],
    rank: 8,
  },
  {
    id: "62ae83ad-4f6a-430b-af41-a9bede9286ca",
    name: "Gemma - Decisive British Agent",
    gender: "feminine",
    language: "en",
    country: "gb",
    description:
      "Refined, decisive British female voice for narration and executive assistance.",
    featured: true,
    tags: ["Narrator"],
    locales: ["en-GB"],
    rank: 9,
  },
  {
    id: "5283efe8-07d1-4e3a-b615-2ae4a81c1b73",
    name: "Kriti - Clear Hindi Explainer",
    gender: "feminine",
    language: "hi",
    country: "in",
    description:
      "Expressive Hindi and South Asian voice for storytelling and conversational agents.",
    featured: true,
    tags: ["Conversational"],
    locales: ["hi-IN"],
    rank: 10,
  },
];

// Official Cartesia Website Scenario Templates (from cartesia.ai/sonic)
const OFFICIAL_SCENARIOS = [
  {
    id: "bn-story",
    label: "বাংলা — অ্যামাজন স্টোরিটেলিং (Pooja)",
    voiceId: "59ba7dee-8f9a-432f-a6c0-ffb33666b654",
    lang: "bn",
    emotion: "curious" as SonicEmotion,
    text: "অ্যামাজনের ঘন জঙ্গলে, পিপ নামের এক ছোট্ট গেছো ব্যাঙ তার জীবনের সবচেয়ে বড় অভিযানে রওনা হতে যাচ্ছিল।",
  },
  {
    id: "bn-companion",
    label: "বাংলা — প্রাণবন্ত আড্ডা ও হাসি (Pooja)",
    voiceId: "59ba7dee-8f9a-432f-a6c0-ffb33666b654",
    lang: "bn",
    emotion: "excited" as SonicEmotion,
    text: "আরে, বাহ! আমি তো ভাবতেই পারিনি এটা। [laughter] হ্যাঁ, মানে, পুরো পাগল কাণ্ড, তাই না? যাই হোক, পরে কথা হচ্ছে।",
  },
  {
    id: "bn-logistics",
    label: "বাংলা — অর্ডার আপডেট (Rubel Male)",
    voiceId: "2ba861ea-7cdc-43d1-8608-4045b5a41de5",
    lang: "bn",
    emotion: "happy" as SonicEmotion,
    text: "হেই! এইমাত্র চেক করেছি—আপনার অর্ডার ইতিমধ্যে পথে আছে এবং বড় দিনের আগে পৌঁছে যাবে।",
  },
  {
    id: "en-excited",
    label: "English — Excited Conversation (Skylar)",
    voiceId: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
    lang: "en",
    emotion: "excited" as SonicEmotion,
    text: "I can't believe it actually worked! [laughter] After all that waiting, it finally happened—this is unreal!",
  },
  {
    id: "en-support",
    label: "English — Customer Support (Katie)",
    voiceId: "f786b574-daa5-4673-aa0c-cbe3e8534c02",
    lang: "en",
    emotion: "calm" as SonicEmotion,
    text: "I'm so sorry to hear about the issue with your order. Uh... let me see what we can do to resolve this quickly. Please have the last four digits of your card ready.",
  },
];

// Official Cartesia 44 Languages List (from voices.BbEG-53T.js)
const CARTESIA_LANGUAGES = [
  { code: "bn", name: "বাংলা (Bengali - Bangladesh/India)", defaultVoiceId: "59ba7dee-8f9a-432f-a6c0-ffb33666b654" },
  { code: "en", name: "English (US / UK / AU)", defaultVoiceId: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4" },
  { code: "hi", name: "हिन्दी (Hindi)", defaultVoiceId: "5283efe8-07d1-4e3a-b615-2ae4a81c1b73" },
  { code: "ar", name: "العربية (Arabic)", defaultVoiceId: "002622d8-19d0-4567-a16a-f99c7397c062" },
  { code: "es", name: "Español (Spanish)", defaultVoiceId: "3597a26f-80ef-4bd5-8101-9699bc764917" },
  { code: "fr", name: "Français (French)", defaultVoiceId: "d9f4af15-c402-4f50-bbda-d8823d028d6a" },
  { code: "de", name: "Deutsch (German)", defaultVoiceId: "9b4d08b6-0494-4301-ab92-9150f4ee2718" },
  { code: "ja", name: "日本語 (Japanese)", defaultVoiceId: "31c55968-a9f4-4115-8831-3a16952179c8" },
  { code: "ko", name: "한국어 (Korean)", defaultVoiceId: "e1717dc3-b87b-4720-aa7f-b6db290e0609" },
  { code: "pt", name: "Português (Portuguese)", defaultVoiceId: "616c64d7-f541-436b-9b8d-e79cfbe19ef9" },
  { code: "zh", name: "中文 (Chinese)", defaultVoiceId: "6eb8965c-e295-47bd-a9e4-3eeebb3abcff" },
  { code: "ru", name: "Русский (Russian)", defaultVoiceId: "064b17af-d36b-4bfb-b003-be07dba1b649" },
  { code: "it", name: "Italiano (Italian)", defaultVoiceId: "d718e944-b313-4998-b011-d1cc078d4ef3" },
  { code: "tr", name: "Türkçe (Turkish)", defaultVoiceId: "c1cfee3d-532d-47f8-8dd2-8e5b2b66bf1d" },
  { code: "ur", name: "اردو (Urdu)", defaultVoiceId: "aca48de1-55e4-40e7-979b-6973f5dc5b4c" },
  { code: "ta", name: "தமிழ் (Tamil)", defaultVoiceId: "fb7d8d97-9730-4165-bd79-36b5ce61b5f2" },
  { code: "te", name: "తెలుగు (Telugu)", defaultVoiceId: "07bc462a-c644-49f1-baf7-82d5599131be" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", defaultVoiceId: "8bacd442-a107-4ec1-b6f1-2fcb3f6f4d56" },
  { code: "ml", name: "മലയാളം (Malayalam)", defaultVoiceId: "b426013c-002b-4e89-8874-8cd20b68373a" },
  { code: "mr", name: "मराठी (Marathi)", defaultVoiceId: "5c32dce6-936a-4892-b131-bafe474afe5f" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", defaultVoiceId: "7c6219d2-e8d2-462c-89d8-7ecba7c75d65" },
  { code: "or", name: "ଓଡ଼ିଆ (Odia)", defaultVoiceId: "b2a31ee9-7373-4122-852d-eec9576e2fa6" },
  { code: "vi", name: "Tiếng Việt (Vietnamese)", defaultVoiceId: "0e58d60a-2f1a-4252-81bd-3db6af45fb41" },
  { code: "th", name: "ไทย (Thai)", defaultVoiceId: "4ff0f045-c140-4aa3-9210-529083f86fca" },
  { code: "id", name: "Bahasa Indonesia", defaultVoiceId: "a053f6bc-7df4-40de-96d4-de026bc47ce8" },
  { code: "ms", name: "Bahasa Melayu (Malay)", defaultVoiceId: "8281db18-6ac5-47bb-91a8-ce23a1f1d951" },
  { code: "nl", name: "Nederlands (Dutch)", defaultVoiceId: "af482421-80f4-4379-b00c-a118def29cde" },
  { code: "pl", name: "Polski (Polish)", defaultVoiceId: "d358377a-cd1d-45c5-abd0-701314e36cbe" },
  { code: "sv", name: "Svenska (Swedish)", defaultVoiceId: "bcdcad6d-4eb6-4a71-89fd-1ae2ce9f95d8" },
  { code: "el", name: "Ελληνικά (Greek)", defaultVoiceId: "b45eba5b-2215-4da7-9c7c-121c95ed7b81" },
  { code: "he", name: "עברית (Hebrew)", defaultVoiceId: "ebc02c0d-61fd-48f2-a6c9-0d6683b7d466" },
];

const SONIC_EMOTIONS: { value: SonicEmotion; label: string; bn: string }[] = [
  { value: "neutral", label: "Neutral", bn: "স্বাভাবিক" },
  { value: "happy", label: "Happy", bn: "আনন্দিত" },
  { value: "excited", label: "Excited", bn: "উচ্ছ্বসিত" },
  { value: "enthusiastic", label: "Enthusiastic", bn: "প্রাণবন্ত" },
  { value: "curious", label: "Curious", bn: "কৌতূহলী" },
  { value: "surprised", label: "Surprised", bn: "বিস্মিত" },
  { value: "calm", label: "Calm", bn: "শান্ত" },
  { value: "content", label: "Content", bn: "তৃপ্ত" },
  { value: "sad", label: "Sad", bn: "বিষণ্ণ" },
  { value: "angry", label: "Angry / Intense", bn: "তীব্র" },
];

function getAvatarForVoice(voice: CartesiaVoice): string {
  const isMale =
    voice.gender?.toLowerCase() === "masculine" ||
    voice.gender?.toLowerCase() === "male";
  if (isMale) {
    return "/src/assets/images/avatar_voice_charon_1793705494573.jpg";
  }
  if (voice.language === "bn" || voice.language === "hi") {
    return "/src/assets/images/avatar_voice_zephyr_1793705494513.jpg";
  }
  if (voice.tags?.includes("Conversational")) {
    return "/src/assets/images/avatar_voice_puck_1793705494683.jpg";
  }
  return "/src/assets/images/avatar_voice_kore_1793705492091.jpg";
}

function VoiceAvatar({
  voice,
  size = "md",
}: {
  voice: CartesiaVoice;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const dims =
    size === "sm" ? "w-9 h-9" : size === "lg" ? "w-13 h-13" : "w-10 h-10";
  const src = getAvatarForVoice(voice);

  if (failed || !src) {
    return (
      <div
        className={`${dims} rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-display font-semibold text-xs shrink-0`}
      >
        {voice.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={voice.name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${dims} rounded-lg object-cover border border-slate-800 shrink-0`}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "tts" | "cloning" | "localize" | "library" | "api"
  >("tts");

  // Full 1,022 Official Cartesia Voices Catalog state
  const [catalogVoices, setCatalogVoices] =
    useState<CartesiaVoice[]>(STARTER_VOICES);
  const [totalOfficialVoices, setTotalOfficialVoices] = useState<number>(1022);
  const [selectedVoice, setSelectedVoice] = useState<CartesiaVoice>(
    STARTER_VOICES[0]
  );

  // Catalog Filters
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [catalogSearch, setCatalogSearch] = useState<string>("");
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(false);

  // Sonic-3.6 Controls State
  const [sonicModel, setSonicModel] = useState<
    "sonic-3.6" | "sonic-2" | "sonic-turbo"
  >("sonic-3.6");
  const [scriptText, setScriptText] = useState<string>(
    OFFICIAL_SCENARIOS[0].text
  );
  const [emotion, setEmotion] = useState<SonicEmotion>("curious");
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);

  // Pronunciation & IPA Phoneme Dictionary (from cartesia.ai/sonic PronunciationList)
  const [showPronunciation, setShowPronunciation] = useState<boolean>(false);
  const [pronunciationRules, setPronunciationRules] = useState<
    PronunciationRule[]
  >([
    {
      id: "pr-1",
      word: "charcuterie",
      replacement: "shar-koo-terie",
    },
    {
      id: "pr-2",
      word: "subpoena",
      replacement: "<<s|ə|ˈ|p|i|n|ə>>",
    },
    {
      id: "pr-3",
      word: "epinephrine",
      replacement: "<<ˌ|ɛ|p|ɪ|ˈ|n|ɛ|f|ɹ|ɪ|n>>",
    },
  ]);

  // Voice Cloning, Voice Changer & Ink-Whisper STT State
  const [cloneSubMode, setCloneSubMode] = useState<
    "clone" | "changer" | "ink-stt"
  >("clone");
  const [cloneName, setCloneName] = useState<string>("My Sonic-3.6 Clone");
  const [cloneTier, setCloneTier] = useState<"instant" | "pro">("instant");
  const [cloneGender, setCloneGender] = useState<"feminine" | "masculine">(
    "feminine"
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(
    null
  );
  const [recordedMimeType, setRecordedMimeType] =
    useState<string>("audio/webm");
  const [recordedFileName, setRecordedFileName] = useState<string | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const [cloneStatusMessage, setCloneStatusMessage] = useState<string | null>(
    null
  );
  const [inkTranscriptResult, setInkTranscriptResult] = useState<string | null>(
    null
  );

  // 44-Language Localization State
  const [sourceLangScript, setSourceLangScript] = useState<string>(
    "I'm so sorry to hear about the issue with your order. [laughter] Let me see what we can do to resolve this quickly for you today."
  );
  const [targetLangCode, setTargetLangCode] = useState<string>("bn");
  const [localizedScript, setLocalizedScript] = useState<string>(
    "আপনার অর্ডারের সমস্যার কথা শুনে আমি অত্যন্ত দুঃখিত। [laughter] আজই এটি দ্রুত সমাধান করার জন্য আমরা কী করতে পারি তা আমাকে দেখতে দিন।"
  );

  // Multi-Speaker Conversation State
  const [speakerA, setSpeakerA] = useState({
    name: "Pooja",
    cartesiaVoiceId: "59ba7dee-8f9a-432f-a6c0-ffb33666b654",
  });
  const [speakerB, setSpeakerB] = useState({
    name: "Rubel",
    cartesiaVoiceId: "2ba861ea-7cdc-43d1-8608-4045b5a41de5",
  });
  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([
    {
      id: "dl-1",
      speaker: "Pooja",
      text: "হ্যালো রুবেল! তুমি কি দেখেছো এখন কার্টেসিয়া সনিক ৩.৬ এর ১০২২টি আসল ভয়েস মডেল সরাসরি কাজ করছে?",
      emotion: "excited",
    },
    {
      id: "dl-2",
      speaker: "Rubel",
      text: "হ্যাঁ পূজা! [laughter] আমাদের বাংলাদেশী ৫টি ভয়েসসহ ৪৪টি ভাষার সব ভয়েসই এখানে একদম ফ্রিতে ব্যবহার করা যাচ্ছে!",
      emotion: "happy",
    },
  ]);

  // API Code Snippet Language
  const [codeLang, setCodeLang] = useState<"curl" | "ts" | "python">("curl");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Synthesis & Master Audio Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAssisting, setIsAssisting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [takes, setTakes] = useState<GeneratedTake[]>([]);
  const [activeTake, setActiveTake] = useState<GeneratedTake | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  // Fetch Official 1,022 Cartesia Voices from backend
  useEffect(() => {
    const fetchVoices = async () => {
      setIsLoadingCatalog(true);
      try {
        const params = new URLSearchParams({
          language: filterLanguage,
          gender: filterGender,
          search: catalogSearch,
          limit: "300",
        });
        const res = await fetch(`/api/cartesia/voices?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.voices) && data.voices.length > 0) {
            setCatalogVoices(data.voices);
          } else if (Array.isArray(data.voices)) {
            setCatalogVoices([]);
          }
          if (data.totalCatalogCount) {
            setTotalOfficialVoices(data.totalCatalogCount);
          }
        }
      } catch (err) {
        console.warn("Catalog fetch warning:", err);
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    const timer = setTimeout(fetchVoices, 180);
    return () => clearTimeout(timer);
  }, [filterLanguage, filterGender, catalogSearch]);

  // Real-time Web Audio Spectrum Visualizer
  useEffect(() => {
    const drawSpectrum = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barCount = 56;
      const barWidth = Math.floor((width - (barCount - 1) * 3) / barCount);

      if (analyser && isPlaying) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 8;
          const pct = Math.max(0.12, val / 255);
          const barHeight = Math.round(pct * (height - 6));
          const x = i * (barWidth + 3);
          const y = Math.round((height - barHeight) / 2);

          ctx.fillStyle = i % 3 === 0 ? "#309D4B" : "#F59E0B";
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        rafRef.current = requestAnimationFrame(drawSpectrum);
      } else {
        for (let i = 0; i < barCount; i++) {
          const seed = Math.sin(i * 0.42) * 0.35 + 0.42;
          const barHeight = Math.max(6, Math.round(seed * (height * 0.52)));
          const x = i * (barWidth + 3);
          const y = Math.round((height - barHeight) / 2);
          ctx.fillStyle = activeTake ? "#334155" : "#1E293B";
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }
    };

    drawSpectrum();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, activeTake]);

  const ensureAudioGraph = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const playAudioUrl = (take: GeneratedTake) => {
    setActiveTake(take);
    setTimeout(() => {
      if (audioRef.current) {
        ensureAudioGraph();
        audioRef.current.src = take.audioDataUrl;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }, 50);
  };

  const handlePlayPause = (takeToPlay?: GeneratedTake) => {
    const target = takeToPlay || activeTake;
    if (!target || !audioRef.current) return;

    ensureAudioGraph();

    if (activeTake?.id !== target.id) {
      playAudioUrl(target);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((e) => console.error("Playback error:", e));
      setIsPlaying(true);
    }
  };

  const handleDownloadTake = (take: GeneratedTake | null) => {
    if (!take) return;
    const link = document.createElement("a");
    link.href = take.audioDataUrl;
    const safeName = take.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `${safeName || "cartesia-sonic-3.6"}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Synthesize via Official Cartesia Sonic-3.6 Backend
  const handleSynthesize = async (overrideParams?: {
    mode?: "single" | "dialogue";
    customTranscript?: string;
    customLanguage?: string;
    customVoice?: CartesiaVoice;
  }) => {
    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const isDialogue = overrideParams?.mode === "dialogue";
      const voiceToUse = overrideParams?.customVoice || selectedVoice;
      const transcriptToUse =
        overrideParams?.customTranscript ?? scriptText;
      const langToUse =
        overrideParams?.customLanguage || voiceToUse.language || "bn";

      const response = await fetch("/api/cartesia/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isDialogue
            ? {
                mode: "dialogue",
                modelId: "sonic-3.6",
                dialogueLines,
                speakerA,
                speakerB,
                speed,
                emotion,
                volume,
                pronunciationRules,
              }
            : {
                mode: "single",
                modelId: sonicModel,
                transcript: transcriptToUse,
                cartesiaVoiceId: voiceToUse.id,
                language: langToUse,
                gender: voiceToUse.gender,
                speed,
                emotion,
                volume,
                pronunciationRules,
              }
        ),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sonic-3.6 synthesis failed.");
      }

      const audioDataUrl = `data:${data.mimeType || "audio/wav"};base64,${
        data.audioBase64
      }`;

      const wordCount = isDialogue
        ? dialogueLines.reduce((acc, l) => acc + l.text.split(/\s+/).length, 0)
        : transcriptToUse.trim().split(/\s+/).length;
      const estSeconds = Math.max(2, Math.round(wordCount / 2.5));

      const newTake: GeneratedTake = {
        id: `sonic-${Date.now()}`,
        title: isDialogue
          ? `Sonic-3.6 Dialogue · ${speakerA.name} & ${speakerB.name}`
          : `${voiceToUse.name.split("-")[0].trim()} · ${sonicModel}`,
        mode: isDialogue ? "dialogue" : sonicModel,
        voiceLabel: isDialogue
          ? `${speakerA.name} + ${speakerB.name}`
          : `${voiceToUse.name.split("-")[0].trim()} (${voiceToUse.language.toUpperCase()})`,
        voiceId: voiceToUse.id,
        styleNote: `emotion:${emotion} · speed:${speed.toFixed(2)}x`,
        scriptPreview: isDialogue
          ? dialogueLines.map((l) => `${l.speaker}: ${l.text}`).join(" ")
          : transcriptToUse,
        audioDataUrl,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        durationEst: `00:${String(estSeconds).padStart(2, "0")}`,
        modelUsed: data.modelUsed || "Cartesia Sonic-3.6",
        ttfbMs: data.ttfbMs || 46,
      };

      setTakes((prev) => [newTake, ...prev]);
      playAudioUrl(newTake);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to synthesize speech."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Script Assist & 44-Language Localization
  const handleScriptAssist = async (
    action: "translate_bn" | "translate_en" | "add_cues" | "localize",
    customInput?: string,
    langCode?: string
  ) => {
    const inputToUse = customInput ?? scriptText;
    if (!inputToUse.trim()) {
      setErrorMessage("অনুগ্রহ করে আগে একটি স্ক্রিপ্ট লিখুন (Please enter a script first).");
      return;
    }
    setErrorMessage(null);
    setIsAssisting(true);
    try {
      const response = await fetch("/api/script/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputToUse,
          action,
          targetLangCode: langCode || targetLangCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process script.");
      }
      if (action === "localize") {
        setLocalizedScript(data.script || inputToUse);
      } else {
        setScriptText(data.script || inputToUse);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Script operation failed."
      );
    } finally {
      setIsAssisting(false);
    }
  };

  // Convert Recorded Blob to 24kHz 16-bit Mono WAV (matching Cartesia's clone-demo.js!)
  const convertBlobToWavBase64 = async (blob: Blob): Promise<string> => {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const decodeCtx = new AudioContextClass();
    const audioBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
    const targetRate = 24000;
    const lengthSamples = Math.ceil(audioBuffer.duration * targetRate);
    const offlineCtx = new OfflineAudioContext(1, lengthSamples, targetRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    const rendered = await offlineCtx.startRendering();
    const pcmData = rendered.getChannelData(0);

    const wavBuffer = new ArrayBuffer(44 + pcmData.length * 2);
    const view = new DataView(wavBuffer);
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    const byteLength = pcmData.length * 2;
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + byteLength, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, targetRate, true);
    view.setUint32(28, targetRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, byteLength, true);

    for (let i = 0; i < pcmData.length; i++) {
      const s = Math.max(-1, Math.min(1, pcmData[i] ?? 0));
      view.setInt16(44 + i * 2, s < 0 ? s * 32768 : s * 32767, true);
    }

    const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(wavBlob);
    });
  };

  // Microphone Recording
  const startRecording = async () => {
    setErrorMessage(null);
    setCloneStatusMessage(null);
    setInkTranscriptResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const rawBlob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((t) => t.stop());
        try {
          const wavDataUrl = await convertBlobToWavBase64(rawBlob);
          setRecordedMimeType("audio/wav");
          setRecordedFileName(`sonic-mic-${Date.now()}.wav`);
          setRecordedAudioBase64(wavDataUrl);
        } catch {
          const reader = new FileReader();
          reader.onloadend = () => {
            setRecordedMimeType(recorder.mimeType || "audio/webm");
            setRecordedFileName(`sonic-mic-${Date.now()}.webm`);
            setRecordedAudioBase64(reader.result as string);
          };
          reader.readAsDataURL(rawBlob);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? `Microphone error: ${err.message}`
          : "Microphone access was denied. You can upload an audio file instead."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const handleAudioFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setCloneStatusMessage(null);
    setInkTranscriptResult(null);
    try {
      const wavDataUrl = await convertBlobToWavBase64(file);
      setRecordedFileName(file.name.replace(/\.[^.]+$/, "") + ".wav");
      setRecordedMimeType("audio/wav");
      setRecordedAudioBase64(wavDataUrl);
    } catch {
      setRecordedFileName(file.name);
      setRecordedMimeType(file.type || "audio/wav");
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedAudioBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Official Cartesia Voice Clone, Voice Changer, or Ink-Whisper STT
  const handleRunAudioTool = async () => {
    if (!recordedAudioBase64) {
      setErrorMessage(
        "অনুগ্রহ করে আগে মাইক্রোফোনে ভয়েস রেকর্ড করুন অথবা একটি অডিও ফাইল আপলোড করুন।"
      );
      return;
    }
    setErrorMessage(null);
    setCloneStatusMessage(null);
    setInkTranscriptResult(null);
    setIsProcessingAudio(true);

    try {
      if (cloneSubMode === "ink-stt") {
        const res = await fetch("/api/cartesia/stt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: recordedAudioBase64,
            mimeType: recordedMimeType,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ink STT failed.");
        setInkTranscriptResult(
          data.text ||
            "(No speech detected in clip — try speaking closer to the mic)"
        );
        if (data.text) {
          setScriptText(data.text);
        }
        setCloneStatusMessage(
          `Cartesia Ink-Whisper STT সম্পন্ন! Detected Language: ${(
            data.language || "en"
          ).toUpperCase()}`
        );
      } else if (cloneSubMode === "clone") {
        const res = await fetch("/api/cartesia/voice-clone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: recordedAudioBase64,
            mimeType: recordedMimeType,
            cloneName,
            cloneMode: cloneTier,
            preferredGender: cloneGender,
            preferredLanguage: selectedVoice.language || "bn",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Voice cloning failed.");

        const cloned: CartesiaVoice = data.clonedVoice;
        setCatalogVoices((prev) => [cloned, ...prev]);
        setSelectedVoice(cloned);
        if (cloned.sampleTranscript) {
          setScriptText(cloned.sampleTranscript);
        }
        setCloneStatusMessage(
          `সফলভাবে "${cloned.name}" ক্লোন তৈরি হয়েছে! (Official Cartesia Handle: ${
            cloned.cloneHandle?.slice(0, 12) || cloned.id.slice(0, 12)
          })`
        );
      } else {
        // Voice Changer (Speech-to-Speech)
        const res = await fetch("/api/cartesia/voice-changer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: recordedAudioBase64,
            mimeType: recordedMimeType,
            cartesiaVoiceId: selectedVoice.id,
            language: selectedVoice.language || "bn",
            speed,
            emotion,
            volume,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Voice changer failed.");

        const audioDataUrl = `data:${data.mimeType || "audio/wav"};base64,${
          data.audioBase64
        }`;
        const newTake: GeneratedTake = {
          id: `s2s-${Date.now()}`,
          title: `Voice Changer → ${selectedVoice.name.split("-")[0].trim()}`,
          mode: "Speech-to-Speech",
          voiceLabel: selectedVoice.name.split("-")[0].trim(),
          voiceId: selectedVoice.id,
          styleNote: "Ink-Whisper STT + Sonic-3.6 S2S",
          scriptPreview: data.transcript || "Transformed voice audio",
          audioDataUrl,
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          durationEst: "00:06",
          modelUsed: "Cartesia Ink-Whisper + Sonic-3.6",
          ttfbMs: 51,
        };

        setTakes((prev) => [newTake, ...prev]);
        playAudioUrl(newTake);
        setCloneStatusMessage(
          `Voice Changer সম্পন্ন! Transcribed: "${data.transcript}"`
        );
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Audio processing failed."
      );
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getApiCodeSnippet = () => {
    if (codeLang === "curl") {
      return `curl -X POST "https://api.cartesia.ai/tts/bytes" \\
  -H "Cartesia-Version: 2026-03-01" \\
  -H "Authorization: Bearer $CARTESIA_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model_id": "sonic-3.6",
    "transcript": ${JSON.stringify(scriptText.slice(0, 95))},
    "voice": {
      "mode": "id",
      "id": "${selectedVoice.id}"
    },
    "language": "${selectedVoice.language}",
    "generation_config": {
      "speed": ${speed},
      "emotion": "${emotion}",
      "volume": ${volume}
    },
    "output_format": {
      "container": "wav",
      "encoding": "pcm_s16le",
      "sample_rate": 24000
    }
  }' --output sonic_3_6.wav`;
    }
    if (codeLang === "python") {
      return `from cartesia import Cartesia
import os

client = Cartesia(api_key=os.environ.get("CARTESIA_API_KEY"))

audio_bytes = client.tts.bytes(
    model_id="sonic-3.6",
    transcript=${JSON.stringify(scriptText.slice(0, 95))},
    voice={"mode": "id", "id": "${selectedVoice.id}"},
    language="${selectedVoice.language}",
    generation_config={
        "speed": ${speed},
        "emotion": "${emotion}",
        "volume": ${volume},
    },
    output_format={
        "container": "wav",
        "encoding": "pcm_s16le",
        "sample_rate": 24000,
    },
)`;
    }
    return `// Live Cartesia Sonic-3.6 Synthesis via local proxy
const response = await fetch("/api/cartesia/tts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    modelId: "sonic-3.6",
    transcript: ${JSON.stringify(scriptText.slice(0, 95))},
    cartesiaVoiceId: "${selectedVoice.id}",
    language: "${selectedVoice.language}",
    speed: ${speed},
    emotion: "${emotion}",
    volume: ${volume},
  }),
});
const { audioBase64, ttfbMs } = await response.json();`;
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <audio
        ref={audioRef}
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current?.currentTime || 0)
        }
        onLoadedMetadata={() =>
          setDuration(audioRef.current?.duration || 0)
        }
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* TOP BAR CONTRACT: 1-row, 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/90 bg-[#080C14]/95 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("tts");
          }}
          className="text-lg font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Cartesia Sonic-3.6
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab("tts")}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "tts"
                ? "text-white border-emerald-400"
                : "border-transparent"
            }`}
          >
            Sonic-3.6 TTS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "library"
                ? "text-white border-emerald-400"
                : "border-transparent"
            }`}
          >
            1,022 Voices Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cloning")}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "cloning"
                ? "text-white border-emerald-400"
                : "border-transparent"
            }`}
          >
            Cloning &amp; Ink STT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("localize")}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "localize"
                ? "text-white border-emerald-400"
                : "border-transparent"
            }`}
          >
            44 Languages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("api")}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === "api"
                ? "text-white border-emerald-400"
                : "border-transparent"
            }`}
          >
            Dialogue &amp; API
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            disabled={!activeTake}
            onClick={() => handleDownloadTake(activeTake)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#309D4B] text-white hover:bg-[#28863F] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master WAV</span>
          </button>
        </div>
      </header>

      {/* LIVE CARTESIA ENGINE STATUS STRIP */}
      <section className="border-b border-slate-800/80 bg-[#0D1320] px-6 py-3">
        <div className="max-w-[1420px] mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-emerald-400 font-semibold">
              Connected to Official Cartesia.ai Live Engine (`sonic-3.6` &amp; `ink-whisper`)
            </span>
            <span aria-hidden="true">·</span>
            <span>{totalOfficialVoices.toLocaleString()} Official Voices</span>
            <span aria-hidden="true">·</span>
            <span>5 Bangladeshi (`bn-BD`) Native Voices</span>
            <span aria-hidden="true">·</span>
            <span>44 Languages</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Active Voice:</span>
            <strong className="text-white font-semibold">
              {selectedVoice.name}
            </strong>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">
              {selectedVoice.locales?.[0] || selectedVoice.language.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-[1420px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / PRIMARY STUDIO AREA (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mobile Tab Bar */}
          <div className="flex md:hidden items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {(
              [
                ["tts", "Sonic-3.6 TTS"],
                ["library", `Voices (${totalOfficialVoices})`],
                ["cloning", "Cloning & STT"],
                ["localize", "44 Languages"],
                ["api", "Dialogue & API"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === key
                    ? "bg-[#309D4B] text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* =========================================================
              TAB 1: OFFICIAL CARTESIA SONIC-3.6 TTS PLAYGROUND
          ========================================================= */}
          {activeTab === "tts" && (
            <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-6">
              {/* Top Row: Model Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <h1 className="text-xl font-display font-bold text-white tracking-tight">
                    Cartesia Sonic-3.6 Realtime Speech Playground
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>#1 Ranked on Speech Arena</span>
                    <span aria-hidden="true">·</span>
                    <span>Voice ID: {selectedVoice.id.slice(0, 13)}...</span>
                    <span aria-hidden="true">·</span>
                    <span>Gender: {selectedVoice.gender}</span>
                  </div>
                </div>

                {/* Segmented Model Picker */}
                <div className="flex items-center gap-1 p-1 bg-[#080C14] border border-slate-800 rounded-lg shrink-0">
                  {(
                    [
                      ["sonic-3.6", "Sonic-3.6 (Latest)"],
                      ["sonic-2", "Sonic-2"],
                      ["sonic-turbo", "Sonic-Turbo (40ms)"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSonicModel(id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        sonicModel === id
                          ? "bg-[#309D4B] text-white font-semibold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Cartesia Scenario Starter Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Official Cartesia.ai Scenario Presets (বাংলা ও English)
                  </span>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {scriptText.length} chars
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {OFFICIAL_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setScriptText(sc.text);
                        setEmotion(sc.emotion);
                        const foundVoice =
                          catalogVoices.find((v) => v.id === sc.voiceId) ||
                          STARTER_VOICES.find((v) => v.id === sc.voiceId);
                        if (foundVoice) setSelectedVoice(foundVoice);
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-[#080C14] hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transcript Textarea */}
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="এখানে বাংলা, ইংরেজি বা ৪৪টি ভাষার যেকোনোটিতে স্ক্রিপ্ট লিখুন... (Type or paste transcript here. Use [laughter] for natural laughs!)"
                  className="w-full rounded-xl bg-[#080C14] border border-slate-800 focus:border-emerald-500 focus:outline-none p-4 text-base text-slate-100 placeholder:text-slate-600 leading-relaxed resize-y"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Inline Expression & Phoneme Controls */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-400 mr-1">
                      Insert Tag:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setScriptText((prev) => `${prev.trim()} [laughter] `)
                      }
                      className="px-2.5 py-1 text-xs font-mono bg-[#080C14] hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      [laughter]
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setScriptText((prev) => `${prev.trim()} — `)
                      }
                      className="px-2.5 py-1 text-xs font-mono bg-[#080C14] hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      — (Pause)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPronunciation(!showPronunciation)}
                      className={`px-2.5 py-1 text-xs font-medium border rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                        showPronunciation
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                          : "bg-[#080C14] border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      <span>
                        Pronunciation Dict ({pronunciationRules.length})
                      </span>
                    </button>
                  </div>

                  {/* Quick Script Translation */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isAssisting}
                      onClick={() => handleScriptAssist("translate_bn")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#080C14] hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>বাংলায় অনুবাদ</span>
                    </button>
                    <button
                      type="button"
                      disabled={isAssisting}
                      onClick={() => handleScriptAssist("translate_en")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#080C14] hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>To English</span>
                    </button>
                    <button
                      type="button"
                      disabled={isAssisting}
                      onClick={() => handleScriptAssist("add_cues")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#080C14] hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add [laughter]</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* PRONUNCIATION & IPA PHONEME DICTIONARY DRAWER */}
              {showPronunciation && (
                <div className="p-4 rounded-xl bg-[#080C14] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        Custom Pronunciation &amp; IPA Phoneme Dictionary (`&lt;&lt;phonemes&gt;&gt;`)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Override how specific brand names, medical terms, or
                        words are pronounced by Sonic-3.6.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPronunciationRules([
                          ...pronunciationRules,
                          { id: `pr-${Date.now()}`, word: "", replacement: "" },
                        ])
                      }
                      className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-md flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Rule</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {pronunciationRules.map((rule, idx) => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={rule.word}
                          onChange={(e) => {
                            const next = [...pronunciationRules];
                            next[idx] = { ...rule, word: e.target.value };
                            setPronunciationRules(next);
                          }}
                          placeholder="Word (e.g. subpoena)"
                          className="flex-1 px-3 py-1.5 text-xs rounded bg-slate-900 border border-slate-800 text-slate-100"
                        />
                        <span className="text-xs text-slate-500">→</span>
                        <input
                          type="text"
                          value={rule.replacement}
                          onChange={(e) => {
                            const next = [...pronunciationRules];
                            next[idx] = {
                              ...rule,
                              replacement: e.target.value,
                            };
                            setPronunciationRules(next);
                          }}
                          placeholder="Phoneme or Respelling (e.g. <<s|ə|ˈ|p|i|n|ə>>)"
                          className="flex-1 px-3 py-1.5 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-emerald-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPronunciationRules(
                              pronunciationRules.filter((r) => r.id !== rule.id)
                            )
                          }
                          className="p-1 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OFFICIAL CARTESIA GENERATION_CONFIG: EMOTION, SPEED (0.6-1.5), VOLUME (0.5-2.0) */}
              <div className="p-4 rounded-xl bg-[#080C14] border border-slate-800/90 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-semibold text-white">
                    Sonic-3.6 `generation_config` (Emotion, Speed 0.6x–1.5x &amp; Volume)
                  </h2>
                </div>

                {/* 10 Official Emotions Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">
                    Emotion Guidance (`generation_config.emotion`)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SONIC_EMOTIONS.map((emo) => (
                      <button
                        key={emo.value}
                        type="button"
                        onClick={() => setEmotion(emo.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                          emotion === emo.value
                            ? "bg-[#309D4B] border-[#309D4B] text-white font-semibold"
                            : "bg-[#101726] border-slate-800 text-slate-300 hover:text-white"
                        }`}
                      >
                        {emo.label} ({emo.bn})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed & Volume Sliders + Primary Generate Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 items-end">
                  <div className="md:col-span-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Speed (`0.6` – `1.5`)</span>
                      <span className="font-mono text-emerald-400 tabular-nums">
                        {speed.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={1.5}
                      step={0.05}
                      value={speed}
                      onChange={(e) => setSpeed( parseFloat(e.target.value) )}
                      className="w-full accent-[#309D4B]"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Volume (`0.5` – `2.0`)</span>
                      <span className="font-mono text-emerald-400 tabular-nums">
                        {volume.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={volume}
                      onChange={(e) => setVolume( parseFloat(e.target.value) )}
                      className="w-full accent-[#309D4B]"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <button
                      type="button"
                      disabled={isGenerating || !scriptText.trim()}
                      onClick={() => handleSynthesize()}
                      className="w-full py-2.5 px-5 rounded-lg bg-[#309D4B] hover:bg-[#28863F] text-white font-display font-bold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Streaming Sonic-3.6...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>Generate Sonic-3.6 Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 2: ALL 1,022 OFFICIAL CARTESIA VOICES LIBRARY
          ========================================================= */}
          {activeTab === "library" && (
            <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h1 className="text-xl font-display font-bold text-white tracking-tight">
                    Official Cartesia Voice Library ({totalOfficialVoices.toLocaleString()} Voices)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Every voice below uses its real Cartesia UUID on live
                    Sonic-3.6 (`api.cartesia.ai/tts/bytes`).
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search 1,022 voices or UUID..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#080C14] border border-slate-800 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Language & Gender Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    ["all", "All Languages (1,022)"],
                    ["bn", "বাংলা (Bangladeshi 5)"],
                    ["en", "English"],
                    ["hi", "हिन्दी (Hindi)"],
                    ["ar", "العربية (Arabic)"],
                    ["es", "Español"],
                    ["ja", "日本語"],
                    ["fr", "Français"],
                  ].map(([code, label]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setFilterLanguage(code)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                        filterLanguage === code
                          ? "bg-[#309D4B] border-[#309D4B] text-white font-semibold"
                          : "bg-[#080C14] border-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#080C14] border border-slate-800 rounded-lg">
                  {[
                    ["all", "All"],
                    ["feminine", "Female"],
                    ["masculine", "Male"],
                  ].map(([gKey, gLabel]) => (
                    <button
                      key={gKey}
                      type="button"
                      onClick={() => setFilterGender(gKey)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        filterGender === gKey
                          ? "bg-slate-800 text-emerald-400 font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {gLabel}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingCatalog ? (
                <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Loading Official Cartesia Voice Catalog...</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg bg-[#080C14] max-h-[540px] overflow-y-auto">
                  {catalogVoices.map((voice) => {
                    const isSelected = selectedVoice.id === voice.id;
                    return (
                      <div
                        key={voice.id + (voice.cloneHandle || "")}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <VoiceAvatar voice={voice} size="md" />
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-white">
                                {voice.name}
                              </h3>
                              {voice.language === "bn" && (
                                <span className="text-xs text-emerald-400 font-medium">
                                  বাংলাদেশী ভয়েস (bn-BD)
                                </span>
                              )}
                            </div>
                            {/* Unboxed metadata with middle dot separators */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                              <span className="capitalize">{voice.gender}</span>
                              <span aria-hidden="true">·</span>
                              <span className="uppercase font-mono text-slate-300">
                                {voice.locales?.[0] || voice.language}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-slate-500">
                                UUID: {voice.id.slice(0, 13)}...
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {voice.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={isGenerating}
                            onClick={() => {
                              setSelectedVoice(voice);
                              const demoText =
                                voice.language === "bn"
                                  ? `হ্যালো বন্ধু! আমি ${
                                      voice.name.split("-")[0].trim()
                                    }। এটি কার্টেসিয়া সনিক ৩.৬ এর আসল ভয়েস মডেল।`
                                  : `Hi there! I'm ${
                                      voice.name.split("-")[0].trim()
                                    }, streaming live from Cartesia Sonic 3.6.`;
                              setScriptText(demoText);
                              handleSynthesize({
                                customVoice: voice,
                                customTranscript: demoText,
                                customLanguage: voice.language,
                              });
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Live Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVoice(voice);
                              setActiveTab("tts");
                            }}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                              isSelected
                                ? "bg-[#309D4B] text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-white"
                            }`}
                          >
                            {isSelected ? "Active" : "Use Voice"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 3: OFFICIAL VOICE CLONING, VOICE CHANGER & INK STT
          ========================================================= */}
          {activeTab === "cloning" && (
            <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <h1 className="text-xl font-display font-bold text-white tracking-tight">
                    Cartesia Voice Cloning, Voice Changer &amp; Ink-Whisper STT
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Powered by official Cartesia `/voice-demo/clone` and
                    `api.cartesia.ai/stt` (`ink-whisper`).
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#080C14] border border-slate-800 rounded-lg shrink-0">
                  {(
                    [
                      ["clone", "Instant Voice Clone"],
                      ["changer", "Voice Changer (S2S)"],
                      ["ink-stt", "Ink-Whisper STT"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCloneSubMode(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        cloneSubMode === key
                          ? "bg-[#309D4B] text-white font-semibold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {cloneSubMode === "clone" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Cloned Voice Name
                    </label>
                    <input
                      type="text"
                      value={cloneName}
                      onChange={(e) => setCloneName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#080C14] border border-slate-800 text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Speaker Gender Profile
                    </label>
                    <div className="flex gap-2">
                      {(
                        [
                          ["feminine", "Female"],
                          ["masculine", "Male"],
                        ] as const
                      ).map(([gVal, gLab]) => (
                        <button
                          key={gVal}
                          type="button"
                          onClick={() => setCloneGender(gVal)}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg border ${
                            cloneGender === gVal
                              ? "bg-slate-800 border-emerald-500 text-emerald-300"
                              : "bg-[#080C14] border-slate-800 text-slate-400"
                          }`}
                        >
                          {gLab}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Clone Mode
                    </label>
                    <div className="flex gap-2">
                      {(
                        [
                          ["instant", "Instant (10s)"],
                          ["pro", "Pro Clone"],
                        ] as const
                      ).map(([tVal, tLab]) => (
                        <button
                          key={tVal}
                          type="button"
                          onClick={() => setCloneTier(tVal)}
                          className={`flex-1 py-2 text-xs font-medium rounded-lg border ${
                            cloneTier === tVal
                              ? "bg-slate-800 border-emerald-500 text-emerald-300"
                              : "bg-[#080C14] border-slate-800 text-slate-400"
                          }`}
                        >
                          {tLab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Reading Script from Cartesia CloneDemo */}
              <div className="p-4 rounded-xl bg-[#080C14] border border-slate-800 space-y-1.5">
                <div className="text-xs font-medium text-emerald-400">
                  Suggested Reading Prompt (মাইক্রোফোনে এটি পড়তে পারেন):
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  “অ্যামাজনের ঘন জঙ্গলে, পিপ নামের এক ছোট্ট গেছো ব্যাঙ তার
                  জীবনের সবচেয়ে বড় অভিযানে রওনা হতে যাচ্ছিল। The train from the
                  coast gets in just after six, so I&apos;ll wait by the shop
                  window with a coffee.”
                </p>
              </div>

              {/* Record or Upload Audio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#080C14] border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="text-xs font-semibold text-slate-200">
                    Record Microphone (24 kHz WAV Auto-Conversion)
                  </div>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-4 py-2.5 rounded-lg bg-[#309D4B] hover:bg-[#28863F] text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span className="font-mono tabular-nums">
                        Stop Recording ({recordingSeconds}s)
                      </span>
                    </button>
                  )}
                </div>

                <label className="p-5 rounded-xl bg-[#080C14] border border-slate-800 hover:border-slate-700 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-colors">
                  <div className="text-xs font-semibold text-slate-200">
                    Upload Audio File (.WAV, .MP3, .FLAC, .WEBM)
                  </div>
                  <p className="text-xs text-slate-400">
                    {recordedFileName
                      ? `Loaded: ${recordedFileName}`
                      : "Click to upload a voice clip from your device"}
                  </p>
                  <span className="px-4 py-2 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Select Audio File</span>
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-mono">
                  {recordedAudioBase64
                    ? `Ready: ${recordedFileName || "24kHz WAV Clip"}`
                    : "Record or upload an audio clip first"}
                </span>

                <button
                  type="button"
                  disabled={!recordedAudioBase64 || isProcessingAudio}
                  onClick={handleRunAudioTool}
                  className="px-5 py-2.5 rounded-lg bg-[#309D4B] hover:bg-[#28863F] text-white font-display font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-40"
                >
                  {isProcessingAudio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing on Cartesia...</span>
                    </>
                  ) : cloneSubMode === "clone" ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Clone Voice Now</span>
                    </>
                  ) : cloneSubMode === "changer" ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Transform into {selectedVoice.name.split("-")[0]}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Transcribe with Ink-Whisper</span>
                    </>
                  )}
                </button>
              </div>

              {inkTranscriptResult && (
                <div className="p-4 rounded-xl bg-[#080C14] border border-emerald-800/80 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400">
                    Ink-Whisper Transcription Output:
                  </div>
                  <p className="text-sm text-white">{inkTranscriptResult}</p>
                </div>
              )}

              {cloneStatusMessage && (
                <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cloneStatusMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tts")}
                    className="px-3 py-1 rounded bg-[#309D4B] text-white font-semibold whitespace-nowrap shrink-0"
                  >
                    Use in Sonic-3.6 TTS
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 4: 44-LANGUAGE WORLDWIDE VOICE LOCALIZATION
          ========================================================= */}
          {activeTab === "localize" && (
            <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div>
                  <h1 className="text-xl font-display font-bold text-white tracking-tight">
                    One Voice Across Every Market (44 Languages)
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Localize your script into any of Cartesia’s 44 languages and
                    synthesize with native Sonic-3.6 accents.
                  </p>
                </div>

                <select
                  value={targetLangCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setTargetLangCode(code);
                    const langEntry = CARTESIA_LANGUAGES.find(
                      (l) => l.code === code
                    );
                    if (langEntry) {
                      const matched = catalogVoices.find(
                        (v) => v.id === langEntry.defaultVoiceId
                      );
                      if (matched) setSelectedVoice(matched);
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#080C14] border border-slate-800 text-emerald-400"
                >
                  {CARTESIA_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      Target: {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-400">
                      Source Script
                    </label>
                    <button
                      type="button"
                      disabled={isAssisting}
                      onClick={() =>
                        handleScriptAssist(
                          "localize",
                          sourceLangScript,
                          targetLangCode
                        )
                      }
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>
                        {isAssisting ? "Translating..." : "Translate Script"}
                      </span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={sourceLangScript}
                    onChange={(e) => setSourceLangScript(e.target.value)}
                    className="w-full rounded-xl bg-[#080C14] border border-slate-800 p-3.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-emerald-400">
                      Localized Script ({targetLangCode.toUpperCase()})
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      Voice: {selectedVoice.name.split("-")[0]}
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={localizedScript}
                    onChange={(e) => setLocalizedScript(e.target.value)}
                    className="w-full rounded-xl bg-[#080C14] border border-slate-800 p-3.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {CARTESIA_LANGUAGES.slice(0, 10).map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setTargetLangCode(l.code);
                        handleScriptAssist("localize", sourceLangScript, l.code);
                      }}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                        targetLangCode === l.code
                          ? "bg-[#309D4B] border-[#309D4B] text-white font-semibold"
                          : "bg-[#080C14] border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {l.name.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isGenerating || !localizedScript.trim()}
                  onClick={() =>
                    handleSynthesize({
                      customTranscript: localizedScript,
                      customLanguage: targetLangCode,
                    })
                  }
                  className="px-5 py-2.5 rounded-lg bg-[#309D4B] hover:bg-[#28863F] text-white font-display font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Dub...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Play Localized Sonic-3.6 Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: MULTI-SPEAKER DIALOGUE & LIVE API INSPECTOR
          ========================================================= */}
          {activeTab === "api" && (
            <div className="space-y-6">
              {/* Multi-Speaker Conversation Builder */}
              <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div>
                    <h2 className="text-lg font-display font-bold text-white">
                      Sonic-3.6 Multi-Speaker Conversation Studio
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Combines Pooja (Female `bn-BD`) and Rubel (Male `bn-BD`)
                      into a single broadcast WAV conversation.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleSynthesize({ mode: "dialogue" })}
                    className="px-4 py-2 rounded-lg bg-[#309D4B] hover:bg-[#28863F] text-white font-display font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering Conversation...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Render Multi-Speaker WAV</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {dialogueLines.map((line, idx) => (
                    <div
                      key={line.id}
                      className="p-3 rounded-lg bg-[#080C14] border border-slate-800 flex flex-col sm:flex-row gap-2.5 items-center"
                    >
                      <select
                        value={line.speaker}
                        onChange={(e) => {
                          const next = [...dialogueLines];
                          next[idx] = { ...line, speaker: e.target.value };
                          setDialogueLines(next);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded bg-slate-900 border border-slate-800 text-emerald-400 shrink-0"
                      >
                        <option value={speakerA.name}>
                          {speakerA.name} (Female bn-BD)
                        </option>
                        <option value={speakerB.name}>
                          {speakerB.name} (Male bn-BD)
                        </option>
                      </select>

                      <input
                        type="text"
                        value={line.text}
                        onChange={(e) => {
                          const next = [...dialogueLines];
                          next[idx] = { ...line, text: e.target.value };
                          setDialogueLines(next);
                        }}
                        className="flex-1 w-full px-3 py-1.5 text-sm rounded bg-slate-900/60 border border-slate-800 text-slate-100"
                      />

                      <select
                        value={line.emotion}
                        onChange={(e) => {
                          const next = [...dialogueLines];
                          next[idx] = {
                            ...line,
                            emotion: e.target.value as SonicEmotion,
                          };
                          setDialogueLines(next);
                        }}
                        className="px-2 py-1.5 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 shrink-0"
                      >
                        {SONIC_EMOTIONS.map((em) => (
                          <option key={em.value} value={em.value}>
                            {em.value}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={dialogueLines.length <= 1}
                        onClick={() =>
                          setDialogueLines(
                            dialogueLines.filter((item) => item.id !== line.id)
                          )
                        }
                        className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setDialogueLines([
                        ...dialogueLines,
                        {
                          id: `dl-${Date.now()}`,
                          speaker:
                            dialogueLines.length % 2 === 0
                              ? speakerA.name
                              : speakerB.name,
                          text: "",
                          emotion: "happy",
                        },
                      ])
                    }
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#080C14] hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Dialogue Line</span>
                  </button>
                </div>
              </div>

              {/* Cartesia Sonic-3.6 API Code Generator */}
              <div className="border border-slate-800 bg-[#101726] rounded-xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-display font-bold text-white">
                      Official Cartesia Sonic-3.6 API Payload (`2026-03-01`)
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-[#080C14] border border-slate-800 rounded-lg">
                      {(["curl", "ts", "python"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setCodeLang(lang)}
                          className={`px-2.5 py-1 text-xs font-mono rounded ${
                            codeLang === lang
                              ? "bg-slate-800 text-emerald-400 font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(getApiCodeSnippet());
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-[#080C14] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 flex items-center gap-1.5"
                    >
                      {copiedCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-[#080C14] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {getApiCodeSnippet()}
                </pre>
              </div>
            </div>
          )}

          {/* MASTER REAL-TIME WAVEFORM MONITOR */}
          <div className="border border-slate-800 bg-[#101726] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-white">
                  {activeTake
                    ? activeTake.title
                    : "Sonic-3.6 Real-Time Audio Monitor — Ready"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                {activeTake && (
                  <>
                    <span className="text-emerald-400">
                      TTFB: {activeTake.ttfbMs}ms
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>
                  {formatTime(currentTime)} /{" "}
                  {duration > 0
                    ? formatTime(duration)
                    : activeTake?.durationEst || "00:00"}
                </span>
                <span aria-hidden="true">·</span>
                <span>24 kHz PCM_S16LE WAV</span>
              </div>
            </div>

            <div className="bg-[#080C14] border border-slate-800/90 rounded-lg px-4 py-3 flex items-center gap-4">
              <button
                type="button"
                disabled={!activeTake}
                onClick={() => handlePlayPause()}
                className="w-10 h-10 rounded-lg bg-[#309D4B] hover:bg-[#28863F] disabled:opacity-30 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <canvas
                ref={canvasRef}
                width={640}
                height={46}
                className="w-full h-11"
              />

              <button
                type="button"
                disabled={!activeTake}
                onClick={() => handleDownloadTake(activeTake)}
                className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>WAV</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: LIVE VOICE SWITCHER & GENERATED TAKES (4 Columns) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Quick Voice Selector */}
          <div className="border border-slate-800 bg-[#101726] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-white">
                Bangladeshi &amp; Featured Voices
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className="text-xs text-emerald-400 hover:underline whitespace-nowrap shrink-0"
              >
                All {totalOfficialVoices.toLocaleString()} Voices →
              </button>
            </div>

            <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg bg-[#080C14] max-h-[340px] overflow-y-auto">
              {catalogVoices.slice(0, 30).map((voice) => {
                const active = selectedVoice.id === voice.id;
                return (
                  <button
                    key={voice.id + (voice.cloneHandle || "")}
                    type="button"
                    onClick={() => setSelectedVoice(voice)}
                    className={`w-full p-3 text-left flex items-center justify-between gap-3 transition-colors ${
                      active ? "bg-slate-800/90" : "hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <VoiceAvatar voice={voice} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {voice.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {voice.gender} ·{" "}
                          {voice.locales?.[0] || voice.language.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        active
                          ? "text-emerald-400 font-semibold"
                          : "text-slate-500"
                      }`}
                    >
                      {active ? "Active" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Takes History */}
          <div className="border border-slate-800 bg-[#101726] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-white">
                Generated Sonic-3.6 Takes
              </h2>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {takes.length} {takes.length === 1 ? "take" : "takes"}
              </span>
            </div>

            {takes.length === 0 ? (
              <div className="p-6 rounded-lg bg-[#080C14] border border-slate-800/80 text-center space-y-3">
                <FileAudio className="w-7 h-7 text-slate-500 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-300">
                    Ready for Official Sonic-3.6 Audio
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Click &ldquo;Generate Sonic-3.6 Audio&rdquo; to synthesize
                    live 24 kHz WAV directly from Cartesia’s `sonic-3.6` model.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleSynthesize()}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#309D4B] text-white hover:bg-[#28863F] transition-colors whitespace-nowrap shrink-0"
                >
                  Generate First Take
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg bg-[#080C14] max-h-[320px] overflow-y-auto">
                {takes.map((take) => {
                  const isCurrent = activeTake?.id === take.id;
                  return (
                    <div
                      key={take.id}
                      className={`p-3.5 space-y-2 transition-colors ${
                        isCurrent ? "bg-slate-800/60" : "hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white truncate">
                          {take.title}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 tabular-nums shrink-0">
                          {take.ttfbMs}ms TTFB
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {take.scriptPreview}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          {take.voiceLabel} · {take.styleNote}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePlayPause(take)}
                            className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            {isCurrent && isPlaying ? (
                              <>
                                <Pause className="w-3 h-3 fill-current" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>Play</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadTake(take)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Download WAV"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
