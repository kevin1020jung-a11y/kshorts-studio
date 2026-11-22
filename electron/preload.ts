import { contextBridge, ipcRenderer } from 'electron';
import type { GenerateScriptRequest, RenderShortsRequest, ShortsProject, AppSettings, AutoPilotSchedule, AutoPilotStatusEvent } from '../src/types';

export const electronAPI = {
  // AI Script Generation
  generateScript: (params: GenerateScriptRequest): Promise<string> => 
    ipcRenderer.invoke('generate-script', params),

  // Full Pipeline Render (Script -> Audio -> ASS -> FFmpeg Video)
  renderShorts: (params: RenderShortsRequest): Promise<{ videoPath: string; videoUrl: string }> => 
    ipcRenderer.invoke('render-shorts', params),

  // Progress listener
  onRenderProgress: (callback: (data: { projectId: string; status: string; progress: number; message: string; errorDetails?: string }) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('render-progress', handler);
    return () => ipcRenderer.removeListener('render-progress', handler);
  },

  // Project Management
  getProjects: (): Promise<ShortsProject[]> => ipcRenderer.invoke('get-projects'),
  saveProject: (project: ShortsProject): Promise<void> => ipcRenderer.invoke('save-project', project),
  deleteProject: (id: string): Promise<void> => ipcRenderer.invoke('delete-project', id),

  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: AppSettings): Promise<void> => ipcRenderer.invoke('save-settings', settings),

  // YouTube Auto-Upload
  uploadToYoutube: (params: { videoPath: string; title: string; description: string; tags?: string[]; privacyStatus?: 'public' | 'unlisted' | 'private'; commentText?: string; autoComment?: boolean }): Promise<{ success: boolean; videoId?: string; videoUrl?: string; commentPosted?: boolean; commentError?: string; error?: string }> =>
    ipcRenderer.invoke('upload-to-youtube', params),

  // AI Auto-Pilot Scheduler
  getAutoPilotConfig: (): Promise<AutoPilotSchedule> => ipcRenderer.invoke('get-autopilot-config'),
  saveAutoPilotConfig: (config: AutoPilotSchedule): Promise<AutoPilotSchedule> => ipcRenderer.invoke('save-autopilot-config', config),
  triggerAutoPilotNow: (): Promise<{ success: boolean; topic?: string; videoUrl?: string; error?: string }> =>
    ipcRenderer.invoke('trigger-autopilot-now'),
  stopAutoPilot: (): Promise<{ success: boolean; message: string }> =>
    ipcRenderer.invoke('stop-autopilot'),
  onAutoPilotStatus: (callback: (data: AutoPilotStatusEvent) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('autopilot-status', handler);
    return () => ipcRenderer.removeListener('autopilot-status', handler);
  },

  // System actions
  showInFolder: (filePath: string): Promise<void> => ipcRenderer.invoke('show-in-folder', filePath),
  openVideoFile: (filePath: string): Promise<void> => ipcRenderer.invoke('open-video-file', filePath),
  // Network Connectivity
  checkNetworkStatus: (): Promise<{ online: boolean }> => ipcRenderer.invoke('check-network-status'),

  // One-Click App Update & Sync
  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke('get-app-version'),
  checkUpdate: (): Promise<import('../src/types').UpdateCheckResult> =>
    ipcRenderer.invoke('check-update'),
  performUpdate: (params?: { downloadUrl?: string; latestVersion?: string; sha256?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('perform-update', params),
  onUpdateStatus: (callback: (data: { message: string }) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('update-status', handler);
    return () => ipcRenderer.removeListener('update-status', handler);
  },
  // Smart Telegram Notification & Multi-Platform Export
  testTelegramNotification: (params: { botToken: string; chatId: string }): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('test-telegram-notification', params),
  exportMultiPlatformBundle: (params: { projectId: string; videoPath: string; title: string; description: string; tags?: string[] }): Promise<import('../src/types').MultiPlatformExportResult> =>
    ipcRenderer.invoke('export-multi-platform-bundle', params),

  // Platform Connection Testing & Verification
  testYoutubeConnection: (params: { clientId: string; clientSecret: string; refreshToken: string }): Promise<{ success: boolean; channelTitle?: string; subscriberCount?: string; hasCommentScope?: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-youtube-connection', params),
  testInstagramConnection: (params: { accountId: string; accessToken: string }): Promise<{ success: boolean; username?: string; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-instagram-connection', params),
  testTikTokConnection: (params: { clientKey?: string; accessToken: string }): Promise<{ success: boolean; displayName?: string; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-tiktok-connection', params),
  testNaverClipConnection: (params: { clientId?: string; clientSecret?: string; channelId?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-naver-clip-connection', params),
  testImageEngine: (params: { engine: string; apiKey?: string; prompt?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-image-engine', params),
  testElevenLabsConnection: (params: { apiKey: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-elevenlabs-connection', params),
  splitScriptScenes: (params: { script: string; title?: string }): Promise<import('../src/types').ScriptScene[]> =>
    ipcRenderer.invoke('split-script-scenes', params),
  fetchTrendingKeywords: (): Promise<{ topic: string; category: string; viewEstimate: string }[]> =>
    ipcRenderer.invoke('fetch-trending-keywords'),
  generateHookingVariants: (params: { topic: string }): Promise<import('../src/types').HookingVariant[]> =>
    ipcRenderer.invoke('generate-hooking-variants', params),
  translateScriptMultilingual: (params: { script: string; title: string }): Promise<import('../src/types').MultilingualTranslationResponse> =>
    ipcRenderer.invoke('translate-script-multilingual', params),
  exportMultilingualBundle: (params: { projectId: string; videoPath: string; originalTitle: string; translations: any }): Promise<{ success: boolean; outputFolder?: string; message?: string; error?: string }> =>
    ipcRenderer.invoke('export-multilingual-bundle', params),
  analyzeYoutubePerformance: (): Promise<{ success: boolean; data?: import('../src/types').YouTubePerformanceAnalysis; error?: string }> =>
    ipcRenderer.invoke('analyze-youtube-performance'),
  getYoutubeLiveStats: (): Promise<{ success: boolean; data?: import('../src/types').YouTubeLiveStats; error?: string }> =>
    ipcRenderer.invoke('get-youtube-live-stats'),
  uploadToInstagram: (params: { videoPath: string; caption: string }): Promise<{ success: boolean; mediaId?: string; message?: string; error?: string }> =>
    ipcRenderer.invoke('upload-to-instagram', params),
  publishToInstagram: (params: { videoPath: string; caption: string; accountId: string; accessToken: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('publish-to-instagram', params),
  publishToTikTok: (params: { videoPath: string; title: string; accessToken: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('publish-to-tiktok', params),
  openExternalUrl: (url: string): Promise<boolean> =>
    ipcRenderer.invoke('open-external-url', url),

  // 1. SFX Preview
  previewSfx: (sfxId: string): Promise<string | null> =>
    ipcRenderer.invoke('preview-sfx', sfxId),

  // 2. Excel/CSV Batch Bulk Generator
  startBatchJob: (config: import('../src/types').BatchJobConfig): Promise<{ success: boolean; totalItems?: number; error?: string }> =>
    ipcRenderer.invoke('start-batch-job', config),
  cancelBatchJob: (): Promise<boolean> =>
    ipcRenderer.invoke('cancel-batch-job'),
  onBatchProgress: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('batch-progress', handler);
    return () => ipcRenderer.removeListener('batch-progress', handler);
  },
  onBatchItemSubprogress: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('batch-item-subprogress', handler);
    return () => ipcRenderer.removeListener('batch-item-subprogress', handler);
  },
  onBatchCompleted: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('batch-completed', handler);
    return () => ipcRenderer.removeListener('batch-completed', handler);
  },

  // 3. 9:16 Vertical Stock Video Search & Selection
  searchStockVideos: (params: { query: string; engine?: string }): Promise<{ success: boolean; videos: Array<{ id: string; url: string; previewUrl: string; duration: number; width: number; height: number; title?: string }> }> =>
    ipcRenderer.invoke('search-stock-videos', params),
  selectLocalVideo: (): Promise<string | null> =>
    ipcRenderer.invoke('select-local-video'),
  selectOutputDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('select-output-directory'),

  // 4. AI Pinned Comments & Voting
  generatePinnedComments: (params: { topic: string; script: string }): Promise<{ success: boolean; suggestions: import('../src/types').PinnedCommentSuggestion[] }> =>
    ipcRenderer.invoke('generate-pinned-comments', params),

  // 5. Video-to-Shorts & Long-to-Shorts Highlight Analyzer & Smart Cutter
  selectSourceVideo: (): Promise<string | null> =>
    ipcRenderer.invoke('select-source-video'),
  analyzeVideoForShorts: (params: { videoPath: string }): Promise<import('../src/types').VideoAnalysisResult> =>
    ipcRenderer.invoke('analyze-video-for-shorts', params),
  renderVideoToShorts: (params: import('../src/types').VideoToShortsParams): Promise<import('../src/types').VideoToShortsResult> =>
    ipcRenderer.invoke('render-video-to-shorts', params),
  analyzeLongVideo: (params: { videoPath: string }): Promise<import('../src/types').VideoAnalysisResult> =>
    ipcRenderer.invoke('analyze-long-video', params),
  extractLongToShorts: (params: any): Promise<import('../src/types').VideoToShortsResult> =>
    ipcRenderer.invoke('extract-long-to-shorts', params),

  // 6. Smart Publishing Scheduler & Calendar
  getScheduledShorts: (): Promise<import('../src/types').ScheduledShortsItem[]> =>
    ipcRenderer.invoke('get-scheduled-shorts'),
  scheduleShort: (params: {
    projectId: string;
    scheduledTime: string;
    platform?: 'youtube' | 'instagram' | 'tiktok' | 'naver' | 'all';
    youtubePrivacy?: 'public' | 'unlisted' | 'private';
  }): Promise<{ success: boolean; item?: import('../src/types').ScheduledShortsItem; error?: string }> =>
    ipcRenderer.invoke('schedule-short', params),
  autoDistributeSchedule: (config: import('../src/types').AutoDistributeConfig): Promise<{
    success: boolean;
    count?: number;
    items?: import('../src/types').ScheduledShortsItem[];
    error?: string;
  }> =>
    ipcRenderer.invoke('auto-distribute-schedule', config),
  cancelScheduledShort: (scheduleId: string): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('cancel-scheduled-short', scheduleId),
  publishScheduledNow: (scheduleId: string): Promise<{
    success: boolean;
    item?: import('../src/types').ScheduledShortsItem;
    publishResults?: any;
    error?: string;
  }> =>
    ipcRenderer.invoke('publish-scheduled-now', scheduleId),

  reloadApp: (): Promise<boolean> => ipcRenderer.invoke('reload-app'),
  relaunchApp: (): Promise<boolean> => ipcRenderer.invoke('relaunch-app'),

  // License (서버 장부 방식: 키 확인·토큰 차감은 메인 프로세스가 라이선스 서버와 직접 처리)
  getLicenseStatus: (): Promise<import('../src/types').LicenseStatus> => ipcRenderer.invoke('license-status'),
  refreshLicense: (): Promise<import('../src/types').LicenseStatus> => ipcRenderer.invoke('license-refresh'),
  activateLicense: (key: string): Promise<{ success: boolean; status?: import('../src/types').LicenseStatus; error?: string }> =>
    ipcRenderer.invoke('license-activate', key),
  logoutLicense: (): Promise<boolean> => ipcRenderer.invoke('license-logout'),
  setAdminSession: (enabled: boolean): Promise<boolean> => ipcRenderer.invoke('license-set-admin', enabled),
  onLicenseStatus: (callback: (status: import('../src/types').LicenseStatus) => void) => {
    const handler = (_: unknown, status: import('../src/types').LicenseStatus) => callback(status);
    ipcRenderer.on('license-status', handler);
    return () => ipcRenderer.removeListener('license-status', handler);
  },

  // Media Connections & Hardware Acceleration & Audio Intelligence
  getRecommendedBgm: (topic: string, channelNiche?: string): Promise<{ filename: string; trackId: string; name: string; reason: string }> =>
    ipcRenderer.invoke('get-recommended-bgm', topic, channelNiche),
  testClaudeConnection: (params?: { apiKey?: string; model?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-claude-connection', params || {}),
  testPexelsConnection: (params?: { apiKey?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-pexels-connection', params || {}),
  testPixabayConnection: (params?: { apiKey?: string }): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke('test-pixabay-connection', params || {}),
  checkGpuAcceleration: (): Promise<import('../src/types').GpuAccelerationInfo> =>
    ipcRenderer.invoke('check-gpu-acceleration'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
