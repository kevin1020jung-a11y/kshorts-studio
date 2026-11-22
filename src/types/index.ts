export type ProjectStatus = 'draft' | 'generating_script' | 'generating_audio' | 'rendering_video' | 'done' | 'error';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male';
  tag: string;
  description: string;
  provider?: 'edge-tts' | 'elevenlabs';
}

export interface TemplateOption {
  id: string;
  name: string;
  tag: string;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  tag: string;
  description: string;
  license: string;
}

export type SubtitleStyleId =
  | 'mrbeast'
  | 'karaoke'
  | 'black_box'
  | 'neon'
  | 'news'
  | 'highlighter'
  | 'ssul_talk'
  | 'samul_1min'
  | 'vlog_aesthetic'
  | 'mystery_crime'
  | 'ranking_top';

export type TitleStyleId =
  | 'yellow_tape'
  | 'breaking'
  | 'dark_pill'
  | 'none'
  | 'ssul_badge'
  | 'caution_hazard'
  | 'gold_luxury'
  | 'quiz_card';

export type SubtitleFontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface SubtitleStyleOption {
  id: SubtitleStyleId;
  name: string;
  tag: string;
  description: string;
  colors: {
    primary: string;
    highlight: string;
    border: string;
    bg: string;
  };
}

export interface TitleStyleOption {
  id: TitleStyleId;
  name: string;
  tag: string;
  description: string;
  badge?: string;
}

export interface ShortsProject {
  id: string;
  title: string;
  prompt: string;
  script: string;
  voiceId: string;
  templateId: string;
  fontId?: string;
  subtitleStyleId?: SubtitleStyleId;
  subtitleFontSize?: SubtitleFontSize;
  titleStyleId?: TitleStyleId;
  durationSeconds: number;
  status: ProjectStatus;
  progressPercent: number;
  statusMessage: string;
  audioPath?: string;
  videoPath?: string;
  videoUrl?: string;
  thumbnailPath?: string;
  thumbnailUrl?: string;
  enableKaraoke?: boolean;
  enableEmojiStickers?: boolean;
  scheduledPublishAt?: string; // ISO 8601 string for scheduled release
  isScheduled?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  /** Anthropic Claude API 키 (대본·제목·번역 등 텍스트 생성 1순위) */
  anthropicApiKey?: string;
  /** 사용할 Claude 모델 (기본: claude-opus-5-5) */
  claudeModel?: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  falApiKey?: string;
  stabilityApiKey?: string;
  elevenlabsApiKey?: string;
  elevenlabsVoiceId?: string;
  pexelsApiKey?: string;
  pixabayApiKey?: string;
  youtubeClientId?: string;
  youtubeClientSecret?: string;
  youtubeRefreshToken?: string;
  youtubeAutoUpload?: boolean;
  youtubeAutoComment?: boolean;
  youtubeCommentText?: string;
  youtubeCommentMode?: 'custom' | 'ai_smart';
  imageEngine?: 'pollinations' | 'openai' | 'fal' | 'stability' | 'pexels' | 'pixabay' | 'gemini';
  videoEngine?: 'motion_gradient' | 'ai_image_motion' | 'stock_video';
  defaultVoiceId: string;
  defaultTemplateId: string;
  defaultFontId?: string;
  defaultSubtitleStyleId?: SubtitleStyleId;
  defaultSubtitleFontSize?: SubtitleFontSize;
  defaultTitleStyleId?: TitleStyleId;
  outputDirectory?: string;
  autoPilot?: AutoPilotSchedule;
  enableBgm?: boolean;
  defaultBgmMood?: string;
  defaultBgmVolume?: number;
  enableHookIntro?: boolean;
  enablePopupSubtitles?: boolean;
  enableKaraoke?: boolean;
  enableEmojiStickers?: boolean;
  defaultVoiceSpeed?: number;
  defaultSubtitleMotionType?: 'bounce' | 'slide_up' | 'fade' | 'typewriter';
  publishScheduleSlots?: string[]; // e.g. ['18:00', '21:00']
  telegramBotToken?: string;
  telegramChatId?: string;
  enableTelegramNotify?: boolean;
  // Instagram Reels
  instagramAccessToken?: string;
  instagramAccountId?: string;
  instagramAutoUpload?: boolean;
  instagramDefaultTags?: string;
  instagramAutoComment?: boolean;
  instagramCommentText?: string;
  // TikTok
  tiktokClientKey?: string;
  tiktokClientSecret?: string;
  tiktokAccessToken?: string;
  tiktokAutoUpload?: boolean;
  tiktokDefaultTags?: string;
  // Naver Clip
  naverClientId?: string;
  naverClientSecret?: string;
  naverClipChannelId?: string;
  naverAutoUpload?: boolean;
  naverDefaultTags?: string;
  naverBlogLink?: string;
  // Monetization & Affiliate Links & SEO Chapters
  enableAutoChapters?: boolean;
  enableAffiliateLinks?: boolean;
  affiliateLinks?: AffiliateLinkItem[];
  affiliateDisclaimer?: string;
  // GPU Acceleration & Video Transitions
  gpuEncoder?: 'auto' | 'nvenc' | 'qsv' | 'cpu';
  highlightKeywords?: boolean;
  transitionType?: 'cut' | 'fade' | 'zoom';
  // Auto-Update & Distribution
  githubRepo?: string; // e.g. "username/kshorts-desktop"
}

export interface GpuAccelerationInfo {
  success: boolean;
  encoder: string;
  extraArgs: string;
  typeName: string;
  badge: string;
  isHardware: boolean;
  message?: string;
  error?: string;
}

export interface AffiliateLinkItem {
  id: string;
  keyword: string;
  label: string;
  url: string;
  isDefault?: boolean;
}

export interface YouTubeLiveVideo {
  id: string;
  title: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  thumbnailUrl: string;
  url: string;
}

export interface YouTubeLiveStats {
  channelTitle: string;
  subscriberCount: string;
  totalViewCount: string;
  totalVideoCount: string;
  thumbnailUrl?: string;
  recentVideos: YouTubeLiveVideo[];
}

export interface BgmOption {
  id: string;
  name: string;
  mood: string;
  filename: string;
  description: string;
  copyrightStatus?: string;
}

export interface GenerateScriptRequest {
  prompt: string;
  durationSeconds?: number;
  tone?: string;
  apiKey?: string;
  geminiApiKey?: string;
  /** 무한 루프 모드: 마지막 문장이 첫 문장으로 자연스럽게 이어지는 대본 */
  loopMode?: boolean;
}

export interface RenderProgressData {
  projectId: string;
  status: ProjectStatus | string;
  progress: number;
  message: string;
  errorDetails?: string;
}

export interface UpdateCheckResult {
  success: boolean;
  hasUpdate?: boolean;
  message: string;
  currentVersion?: string;
  latestVersion?: string;
  currentCommit?: string;
  latestCommit?: string;
  latestCommitMsg?: string;
  newCommitCount?: number;
  downloadUrl?: string;
  sha256?: string;
  updateType?: 'installer' | 'git' | 'manual';
  error?: string;
}

export interface StockVideoItem {
  id: string;
  url: string;
  previewUrl: string;
  duration: number;
  width: number;
  height: number;
  title?: string;
  engine?: 'pexels' | 'pixabay' | 'preset' | 'local';
}

export interface ScriptScene {
  id: number;
  text: string;
  visualPrompt?: string;
  isThumbnail?: boolean;
  estimatedDuration?: number;
  mediaType?: 'image' | 'video';
  videoUrl?: string; // 스톡 비디오 URL 또는 로컬 비디오 파일 경로
  mediaPreviewUrl?: string; // 비디오 썸네일/미리보기 이미지
  videoSource?: 'pexels' | 'pixabay' | 'preset' | 'local';
}

export interface RenderShortsRequest {
  id: string;
  title: string;
  prompt: string;
  script: string;
  voiceId: string;
  templateId: string;
  fontId?: string;
  subtitleStyleId?: SubtitleStyleId;
  subtitleFontSize?: SubtitleFontSize;
  titleStyleId?: TitleStyleId;
  durationSeconds: number;
  bgmMood?: string;
  bgmVolume?: number;
  enableBgm?: boolean;
  enableHookIntro?: boolean;
  enablePopupSubtitles?: boolean;
  enableSfx?: boolean;
  sfxVolume?: number;
  enableStockVideo?: boolean;
  /** 무한 루프 모드: 마지막 문장이 첫 문장으로 이어지도록 대본을 보정 */
  loopMode?: boolean;
  stockVideoEngine?: 'pexels' | 'pixabay' | 'auto';
  enableKaraoke?: boolean;
  enableEmojiStickers?: boolean;
  hookIntroStyleId?: string;
  hookTitleText?: string;
  hookSubtitleText?: string;
  voiceSpeed?: number;
  subtitleMotionType?: 'bounce' | 'slide_up' | 'fade' | 'typewriter';
  highlightKeywords?: boolean;
  syncHighlightSfx?: boolean;
  transitionType?: 'cut' | 'fade' | 'zoom';
  customScenes?: ScriptScene[];
}

export interface BatchItem {
  id: string;
  topic: string;
  voiceId?: string;
  templateId?: string;
  bgmMood?: string;
  status: 'pending' | 'generating' | 'rendering' | 'done' | 'error';
  progress: number;
  message?: string;
  error?: string;
  projectId?: string;
  videoUrl?: string;
}

export interface BatchJobConfig {
  items: Array<{ id?: string; topic: string; voiceId?: string; templateId?: string; bgmMood?: string }>;
  defaultVoiceId?: string;
  defaultTemplateId?: string;
  defaultBgmMood?: string;
  enableSfx?: boolean;
  sfxVolume?: number;
  enableStockVideo?: boolean;
  autoUploadYoutube?: boolean;
  /** 동시에 렌더링할 영상 수 (1~3). 'auto'면 CPU/메모리/부하에 맞춰 자동 결정 */
  maxParallel?: number | 'auto';
  /** 무한 루프 모드 (모든 항목 대본에 적용) */
  loopMode?: boolean;
}

export interface PinnedCommentSuggestion {
  question: string;
  options?: string[];
  fullCommentText: string;
  type: 'balance_game' | 'opinion_vote' | 'summary_quiz';
}

export interface LongToShortsClip {
  startTime: number;
  endTime: number;
  duration: number;
  title: string;
  highlightSummary: string;
  score: number;
}

export interface VideoAnalysisResult {
  success: boolean;
  videoPath?: string;
  totalDuration?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  hasAudio?: boolean;
  audioCodec?: string;
  clips?: LongToShortsClip[];
  error?: string;
}

export interface VideoToShortsParams {
  videoPath: string;
  clip: {
    startTime: number;
    endTime: number;
    duration: number;
    title: string;
    highlightSummary?: string;
  };
  title?: string;
  titleStyleId?: string;
  removeOriginalAudio?: boolean; // 기존 음성 제거(Mute)
  bgmTrack?: string; // 'none' | 'bgm_upbeat' | 'bgm_suspense' | 'bgm_lofi' | 'bgm_epic' | 'bgm_tech'
  bgmVolume?: number; // 0.0 ~ 1.0 (기본 0.35)
  enableSfx?: boolean;
  cropMode?: 'smart_crop' | 'blur_padding' | 'original_ratio';
}

export interface VideoToShortsResult {
  success: boolean;
  projectId?: string;
  videoPath?: string;
  videoUrl?: string;
  thumbnailPath?: string;
  error?: string;
}

export interface LongToShortsRequest {
  videoSource: string;
  targetDurationSeconds?: number;
  focusKeywords?: string[];
  subtitleStyleId?: SubtitleStyleId;
  voiceId?: string;
}

export interface AutoPilotHistoryItem {
  id: string;
  timestamp: string;
  topic: string;
  projectId?: string;
  videoUrl?: string;
  status: 'success' | 'failed' | 'rendering';
  uploadStatus?: 'uploaded' | 'failed' | 'skipped';
  uploadError?: string;
  errorMessage?: string;
  commentStatus?: 'posted' | 'failed' | 'skipped';
  commentError?: string;
  telegramNotified?: boolean;
  platformResults?: Record<string, { success: boolean; url?: string; error?: string }>;
  /** 성과 피드백 모드에서 후속작을 만든 원본 유튜브 영상 ID (같은 영상의 후속작 중복 방지) */
  sourceVideoId?: string;
}

export type AutoPilotFrequency =
  | 'daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'every_6h'
  | 'every_4h'
  | 'every_3h'
  | 'every_2h'
  | 'every_1h'
  | 'custom_hours'
  | 'custom_minutes';

export interface AutoPilotSchedule {
  enabled: boolean;
  scheduleTime: string; // "18:00"
  frequency: AutoPilotFrequency | string;
  customIntervalValue?: number;
  channelNiche: string;
  customInstruction?: string;
  /** 성과 피드백 모드: 조회수가 급상승한 내 영상의 2탄/후속작을 우선 기획 */
  followUpMode?: boolean;
  voiceId?: string;
  templateId?: string;
  fontId?: string;
  subtitleStyleId?: SubtitleStyleId;
  subtitleFontSize?: SubtitleFontSize;
  titleStyleId?: TitleStyleId;
  durationSeconds?: number;
  bgmMood?: string;
  enableBgm?: boolean;
  enableHookIntro?: boolean;
  enablePopupSubtitles?: boolean;
  hookIntroPreset?: string;
  hookTitleText?: string;
  hookSubtitleText?: string;
  autoUploadYoutube?: boolean;
  autoComment?: boolean;
  commentText?: string;
  enableTelegramNotify?: boolean;
  publishPlatforms?: {
    youtube?: boolean;
    instagram?: boolean;
    tiktok?: boolean;
    naverClip?: boolean;
  };
  lastRunAt?: string;
  nextRunAt?: string;
  history?: AutoPilotHistoryItem[];
}

export interface AutoPilotStatusEvent {
  isRunning: boolean;
  currentStep?: string;
  message?: string;
  historyItem?: AutoPilotHistoryItem;
}

export interface MultiPlatformExportResult {
  success: boolean;
  outputFolder: string;
  files: {
    videoFile: string;
    youtubeMeta: string;
    instagramMeta: string;
    tiktokMeta: string;
    naverClipMeta: string;
  };
  summary: string;
}

export interface HookingVariant {
  id: string;
  type: string;
  badge: string;
  title: string;
  hookIntro: string;
  visualKeyword: string;
  ctrScore: number;
  reason: string;
}

export interface MultilingualTranslationItem {
  lang: 'en' | 'ja' | 'es';
  langName: string;
  flag: string;
  title: string;
  script: string;
  recommendedVoiceId: string;
  recommendedVoiceName: string;
  tags: string[];
}

export interface MultilingualTranslationResponse {
  success: boolean;
  translations?: Record<'en' | 'ja' | 'es', MultilingualTranslationItem>;
  error?: string;
  warning?: string;
}

export interface ShortsPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  voiceId: string;
  templateId: string;
  fontId: string;
  subtitleStyleId: SubtitleStyleId;
  subtitleFontSize: SubtitleFontSize;
  titleStyleId: TitleStyleId;
  bgmMood: string;
  bgmVolume: number;
  enableBgm: boolean;
  enableHookIntro: boolean;
  enablePopupSubtitles: boolean;
  isBuiltin?: boolean;
}

export const DEFAULT_PRESETS: ShortsPreset[] = [
  {
    id: 'preset_knowledge_1min',
    name: '1분 상식 & 지식 꿀팁',
    description: '깔끔한 노란색 자막과 프리탠다드 폰트의 신뢰도 높은 정보 전달용',
    icon: '💡',
    voiceId: 'ko-KR-SunHiNeural',
    templateId: 'basic',
    fontId: 'Pretendard',
    subtitleStyleId: 'samul_1min',
    subtitleFontSize: 'medium',
    titleStyleId: 'yellow_tape',
    bgmMood: 'bgm_tech',
    bgmVolume: 0.20,
    enableBgm: true,
    enableHookIntro: true,
    enablePopupSubtitles: true,
    isBuiltin: true,
  },
  {
    id: 'preset_ssul_legend',
    name: '커뮤니티 & 레전드 썰',
    description: '말풍선 스타일 자막과 빠른 템포의 재치있는 썰풀이 전용',
    icon: '💬',
    voiceId: 'ko-KR-HyunsuNeural',
    templateId: 'anime',
    fontId: 'GmarketSansBold',
    subtitleStyleId: 'ssul_talk',
    subtitleFontSize: 'large',
    titleStyleId: 'ssul_badge',
    bgmMood: 'bgm_upbeat',
    bgmVolume: 0.22,
    enableBgm: true,
    enableHookIntro: true,
    enablePopupSubtitles: true,
    isBuiltin: true,
  },
  {
    id: 'preset_mrbeast_viral',
    name: '미스터비스트 파워 바이럴',
    description: '단어 단위 팝업 바운스와 블랙한스 폰트로 시선 강탈 극대화',
    icon: '🔥',
    voiceId: 'ko-KR-InJoonNeural',
    templateId: 'basic',
    fontId: 'Black Han Sans',
    subtitleStyleId: 'mrbeast',
    subtitleFontSize: 'large',
    titleStyleId: 'breaking',
    bgmMood: 'bgm_upbeat',
    bgmVolume: 0.25,
    enableBgm: true,
    enableHookIntro: true,
    enablePopupSubtitles: true,
    isBuiltin: true,
  },
  {
    id: 'preset_mystery_horror',
    name: '미스터리 & 충격 괴담',
    description: '피빛 하이라이트와 중후한 봉진 보이스의 극한 몰입형',
    icon: '😱',
    voiceId: 'ko-KR-BongJinNeural',
    templateId: 'neo_noir',
    fontId: 'Do Hyeon',
    subtitleStyleId: 'mystery_crime',
    subtitleFontSize: 'medium',
    titleStyleId: 'caution_hazard',
    bgmMood: 'bgm_suspense',
    bgmVolume: 0.26,
    enableBgm: true,
    enableHookIntro: true,
    enablePopupSubtitles: true,
    isBuiltin: true,
  },
  {
    id: 'preset_vlog_aesthetic',
    name: '감성 브이로그 & 에세이',
    description: '따뜻한 로파이 BGM과 부드러운 노토산스 감성 자막',
    icon: '☕',
    voiceId: 'ko-KR-JiMinNeural',
    templateId: 'pixar',
    fontId: 'Noto Sans KR',
    subtitleStyleId: 'vlog_aesthetic',
    subtitleFontSize: 'medium',
    titleStyleId: 'dark_pill',
    bgmMood: 'bgm_lofi',
    bgmVolume: 0.16,
    enableBgm: true,
    enableHookIntro: false,
    enablePopupSubtitles: false,
    isBuiltin: true,
  },
];

export interface ScheduledShortsItem {
  id: string;
  projectId: string;
  title: string;
  prompt?: string;
  scheduledTime: string; // ISO 8601 string (e.g. 2026-09-18T18:00:00.000Z)
  targetPlatform: 'youtube' | 'instagram' | 'tiktok' | 'naver' | 'all';
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  videoPath?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  youtubePrivacy?: 'public' | 'unlisted' | 'private';
  tags?: string[];
  description?: string;
  publishedAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface AutoDistributeConfig {
  projectIds: string[];
  startDate: string; // YYYY-MM-DD
  timeSlots: string[]; // e.g. ['18:00', '21:00']
  intervalDays: number; // 1 = daily, 2 = every 2 days
  platform: 'youtube' | 'instagram' | 'tiktok' | 'all';
  youtubePrivacy?: 'public' | 'unlisted' | 'private';
}

/** 메인 프로세스가 라이선스 서버 확인 결과를 정리해 화면에 주는 상태 */
export interface LicenseStatus {
  hasKey: boolean;
  /** 키 끝 4자리 (…ABCD) */
  keyHint: string;
  usable: boolean;
  tokens: number;
  unlimited: boolean;
  /** 만료 시각 (초 단위 epoch, 0 = 무기한) */
  expiresAt: number;
  plan: string;
  enoughTokens: boolean;
  costPerShort: number;
  error: string;
}

export interface YouTubePerformanceVideo {
  id: string;
  title: string;
  views: number;
  viewsPerDay: number;
  /** 채널 중앙값 대비 일평균 조회수 배수 */
  multiple: number;
  isBreakout: boolean;
  alreadyFollowedUp: boolean;
  url: string;
}

export interface YouTubePerformanceAnalysis {
  baselineViewsPerDay: number;
  videoCount: number;
  followUpCandidateId?: string;
  videos: YouTubePerformanceVideo[];
}
