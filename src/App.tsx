import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Wifi, WifiOff, Coins } from 'lucide-react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { LoginScreen } from './components/LoginScreen';
import { DashboardHome } from './components/DashboardHome';

// Creation Section Core Components (Synchronous for fast tab switch)
import { PromptSection } from './components/PromptSection';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceSelector, VOICES } from './components/VoiceSelector';
import { FontSelector, FONTS } from './components/FontSelector';
import { SubtitleStyleSelector, SUBTITLE_STYLES, TITLE_STYLES } from './components/SubtitleStyleSelector';
import { TemplateSelector, TEMPLATES } from './components/TemplateSelector';
import { BgmSelector } from './components/BgmSelector';
import { RenderProgress } from './components/RenderProgress';
import { PresetBar } from './components/PresetBar';
import { UpdateNotificationToast } from './components/UpdateNotificationToast';

// Lazy Loaded Subpages and Modals for Lightning Fast First Paint / TTI
const AISettingsPage = lazy(() => import('./components/AISettingsPage').then((m) => ({ default: m.AISettingsPage })));
const PublishPage = lazy(() => import('./components/PublishPage').then((m) => ({ default: m.PublishPage })));
const AutoPilotPage = lazy(() => import('./components/AutoPilotPage').then((m) => ({ default: m.AutoPilotPage })));
const ProjectManagementPage = lazy(() => import('./components/ProjectManagementPage').then((m) => ({ default: m.ProjectManagementPage })));
const HelpGuidePage = lazy(() => import('./components/HelpGuidePage').then((m) => ({ default: m.HelpGuidePage })));
const PresetsManagementPage = lazy(() => import('./components/PresetsManagementPage').then((m) => ({ default: m.PresetsManagementPage })));
const ThumbnailABEditor = lazy(() => import('./components/ThumbnailABEditor').then((m) => ({ default: m.ThumbnailABEditor })));

const VideoPlayerModal = lazy(() => import('./components/VideoPlayerModal').then((m) => ({ default: m.VideoPlayerModal })));
const ProjectHistoryModal = lazy(() => import('./components/ProjectHistoryModal').then((m) => ({ default: m.ProjectHistoryModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal })));
const UpdateModal = lazy(() => import('./components/UpdateModal').then((m) => ({ default: m.UpdateModal })));
const BatchGeneratorModal = lazy(() => import('./components/BatchGeneratorModal').then((m) => ({ default: m.BatchGeneratorModal })));
const LongToShortsModal = lazy(() => import('./components/LongToShortsModal').then((m) => ({ default: m.LongToShortsModal })));
const VideoToShortsPage = lazy(() => import('./components/VideoToShortsPage').then((m) => ({ default: m.VideoToShortsPage })));
const PublishCalendarModal = lazy(() => import('./components/PublishCalendarModal').then((m) => ({ default: m.PublishCalendarModal })));
import { TokenRechargeModal } from './components/TokenRechargeModal';

const PageLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[360px] text-slate-400 space-y-3 animate-pulse py-16">
    <div className="w-8 h-8 border-2 border-blue-500/25 border-t-blue-600 rounded-full animate-spin" />
    <span className="text-xs font-semibold tracking-tight text-slate-500">화면을 불러오는 중입니다...</span>
  </div>
);

import { Sparkles, Video, RefreshCw } from 'lucide-react';
import type { LicenseStatus, ShortsProject, AppSettings, ProjectStatus, UpdateCheckResult, SubtitleStyleId, TitleStyleId, SubtitleFontSize, ScriptScene, ShortsPreset } from './types';

export default function App() {
  // Authentication / User state with 16-digit license or Admin code verification
  const [user, setUser] = useState<{
    name: string;
    isLoggedIn: boolean;
    licenseKey: string;
    isAdmin: boolean;
  } | null>(() => {
    const savedAuth = localStorage.getItem('kshorts_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        // Security check: Verify master admin session without storing or exposing plaintext code
        // 구매자 빌드에서는 저장된 값(localStorage 조작 포함)으로 관리자 세션을 복원하지 않는다.
        if (__BUYER_BUILD__ && (parsed.isAdmin === true || parsed.licenseKey === 'KSH-MASTER-ADMIN-SESSION')) {
          localStorage.removeItem('kshorts_auth');
          return null;
        }
        if (parsed.isAdmin === true || parsed.licenseKey === 'KSH-MASTER-ADMIN-SESSION') {
          const sanitized = {
            name: parsed.name || '마스터 관리자',
            licenseKey: 'KSH-MASTER-ADMIN-SESSION',
            isAdmin: true,
            isLoggedIn: true,
          };
          localStorage.setItem('kshorts_auth', JSON.stringify(sanitized));
          return sanitized;
        }
        // 정품 키는 메인 프로세스가 보안 저장소에 보관한다. 여기서는 로그인 표시만 복원하고,
        // 실제 유효 여부는 아래 effect 에서 라이선스 서버 상태로 다시 확인한다.
        if (parsed.isLoggedIn && parsed.licenseKey) {
          return {
            name: parsed.name || '정품 크리에이터',
            licenseKey: String(parsed.licenseKey),
            isAdmin: false,
            isLoggedIn: true,
          };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Token state: 100 tokens deducted per shorts generation (Admin has infinite tokens)
  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem('kshorts_tokens');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 0; // Default starting balance until synced from license
  });

  // Navigation state
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Generator State
  const [prompt, setPrompt] = useState('성공한 사람들의 하루 10분 아침 습관');
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [voiceId, setVoiceId] = useState('ko-KR-SunHiNeural');
  const [templateId, setTemplateId] = useState('basic');
  const [fontId, setFontId] = useState('Pretendard');
  const [subtitleStyleId, setSubtitleStyleId] = useState<SubtitleStyleId>('mrbeast');
  const [subtitleFontSize, setSubtitleFontSize] = useState<SubtitleFontSize>('medium');
  const [titleStyleId, setTitleStyleId] = useState<TitleStyleId>('yellow_tape');
  const [durationSeconds, setDurationSeconds] = useState(55);
  const [bgmMood, setBgmMood] = useState<string>('auto');
  const [bgmVolume, setBgmVolume] = useState<number>(0.22);
  const [enableBgm, setEnableBgm] = useState<boolean>(true);
  const [enableHookIntro, setEnableHookIntro] = useState<boolean>(true);
  const [enablePopupSubtitles, setEnablePopupSubtitles] = useState<boolean>(true);
  const [enableKaraoke, setEnableKaraoke] = useState<boolean>(false);
  const [enableEmojiStickers, setEnableEmojiStickers] = useState<boolean>(true);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [sfxVolume, setSfxVolume] = useState<number>(0.35);
  const [enableStockVideo, setEnableStockVideo] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.1);
  const [subtitleMotionType, setSubtitleMotionType] = useState<'bounce' | 'slide_up' | 'fade' | 'typewriter'>('bounce');
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);
  const [syncHighlightSfx, setSyncHighlightSfx] = useState<boolean>(true);
  const [transitionType, setTransitionType] = useState<'cut' | 'fade' | 'zoom'>('fade');
  const [isTokenRechargeModalOpen, setIsTokenRechargeModalOpen] = useState<boolean>(false);

  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<ProjectStatus>('draft');
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderMessage, setRenderMessage] = useState('');
  const [renderErrorDetails, setRenderErrorDetails] = useState<string | undefined>(undefined);

  // App Update State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult | null>(null);
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  const [projects, setProjects] = useState<ShortsProject[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    defaultVoiceId: 'ko-KR-SunHiNeural',
    defaultTemplateId: 'basic',
    defaultFontId: 'Pretendard',
  });

  const [currentProject, setCurrentProject] = useState<ShortsProject | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isLongToShortsModalOpen, setIsLongToShortsModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Network Connectivity Resilience State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [networkToast, setNetworkToast] = useState<{ type: 'offline' | 'restored'; message: string } | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkToast({ type: 'restored', message: '인터넷 연결이 정상 복구되었습니다.' });
      setTimeout(() => setNetworkToast(null), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkToast({
        type: 'offline',
        message: '인터넷 연결이 끊어졌습니다. 네트워크 복구 시까지 온라인 API 기능이 일시 정지됩니다.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check with backend
    if (window.electronAPI?.checkNetworkStatus) {
      window.electronAPI.checkNetworkStatus().then(({ online }) => {
        setIsOnline(online);
        if (!online) {
          setNetworkToast({
            type: 'offline',
            message: '인터넷 연결이 끊어졌습니다. 네트워크 복구 시까지 온라인 API 기능이 일시 정지됩니다.',
          });
        }
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load initial projects & settings from Electron + Check Updates
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getProjects().then(setProjects).catch(console.error);
      window.electronAPI
        .getSettings()
        .then((s) => {
          setSettings(s);
          if (s.defaultVoiceId) setVoiceId(s.defaultVoiceId);
          if (s.defaultTemplateId) setTemplateId(s.defaultTemplateId);
          if (s.defaultFontId) setFontId(s.defaultFontId);
          if (s.defaultSubtitleStyleId) setSubtitleStyleId(s.defaultSubtitleStyleId);
          if (s.defaultSubtitleFontSize) setSubtitleFontSize(s.defaultSubtitleFontSize);
          if (s.defaultTitleStyleId) setTitleStyleId(s.defaultTitleStyleId);
        })
        .catch(console.error);

      // Check for available updates on launch
      window.electronAPI
        .checkUpdate()
        .then((res) => {
          if (res) {
            setUpdateInfo(res);
          }
        })
        .catch(console.error);

      // 새 버전 확인: 3분마다 + 창을 다시 볼 때(1분 이상 지났으면) → 배포하면 곧바로 알림
      let lastUpdateCheck = Date.now();
      const runUpdateCheck = () => {
        lastUpdateCheck = Date.now();
        window.electronAPI
          ?.checkUpdate()
          .then((res) => {
            if (res) {
              setUpdateInfo(res);
            }
          })
          .catch(() => {});
      };
      const updateInterval = setInterval(runUpdateCheck, 3 * 60 * 1000);
      const onFocusCheck = () => { if (Date.now() - lastUpdateCheck > 60 * 1000) runUpdateCheck(); };
      window.addEventListener('focus', onFocusCheck);

      // Listen for render progress
      const cleanupRender = window.electronAPI.onRenderProgress((data) => {
        setRenderStatus(data.status as ProjectStatus);
        setRenderProgress(data.progress);
        setRenderMessage(data.message);
        if (data.errorDetails) {
          setRenderErrorDetails(data.errorDetails);
        }
      });

      // Listen for live update status
      const cleanupUpdate = window.electronAPI.onUpdateStatus?.((data) => {
        setUpdateStatus(data.message);
      });

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('focus', onFocusCheck);
        cleanupRender?.();
        cleanupUpdate?.();
      };
    }
  }, []);

  const handleStartUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus('업데이트 준비 중...');
    setUpdateResult(null);

    try {
      if (window.electronAPI?.performUpdate) {
        const res = await window.electronAPI.performUpdate({
          downloadUrl: updateInfo?.downloadUrl,
          sha256: updateInfo?.sha256,
          latestVersion: updateInfo?.latestVersion,
        });
        setUpdateResult(res);
      } else {
        setUpdateResult({ success: true, message: '업데이트 및 화면 새로고침이 실행되었습니다.' });
      }
    } catch (err: any) {
      setUpdateResult({ success: false, error: err?.message || String(err) });
    } finally {
      setIsUpdating(false);
    }
  };

  // 라이선스 상태 (서버 장부 기준). 토큰·기간은 메인 프로세스가 서버에서 받아 전달한다.
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);

  const applyLicenseStatus = useCallback((s: LicenseStatus) => {
    setLicenseStatus(s);
    setTokens(s.tokens);
    localStorage.setItem('kshorts_tokens', String(s.tokens));
  }, []);

  useEffect(() => {
    const api = window.electronAPI;
    if (!user || !api?.getLicenseStatus) return;
    if (user.isAdmin) {
      void api.setAdminSession?.(true);
      return;
    }
    let cancelled = false;
    const kickOut = (s: LicenseStatus) => {
      alert(`⚠️ ${s.error || '라이선스가 확인되지 않아 로그아웃되었습니다.'}\n\n키를 다시 입력해 주세요.`);
      handleLogout();
    };
    api.refreshLicense().then((s) => {
      if (cancelled) return;
      if (!s.hasKey) kickOut(s);
      else applyLicenseStatus(s);
    }).catch(() => {});
    const off = api.onLicenseStatus((s) => {
      if (!s.hasKey) kickOut(s);
      else applyLicenseStatus(s);
    });
    const onFocus = () => { void api.refreshLicense().catch(() => {}); };
    window.addEventListener('focus', onFocus);
    return () => {
      cancelled = true;
      off();
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.isAdmin, user?.isLoggedIn, applyLicenseStatus]);

  const handleLogin = (data: { userName: string; licenseKey: string; isAdmin: boolean; tokens?: number }) => {
    const newUser = {
      name: data.userName,
      licenseKey: data.isAdmin ? 'KSH-MASTER-ADMIN-SESSION' : data.licenseKey,
      isAdmin: data.isAdmin,
      isLoggedIn: true,
    };
    setUser(newUser);
    localStorage.setItem('kshorts_auth', JSON.stringify(newUser));
    void window.electronAPI?.setAdminSession?.(data.isAdmin);

    const initialTokens = data.isAdmin ? 999999999 : (typeof data.tokens === 'number' ? data.tokens : 0);
    setTokens(initialTokens);
    localStorage.setItem('kshorts_tokens', String(initialTokens));
  };

  const handleLogout = () => {
    void window.electronAPI?.logoutLicense?.();
    setUser(null);
    localStorage.removeItem('kshorts_auth');
    localStorage.removeItem('kshorts_user');
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
  };

  const handleGenerateScript = async () => {
    if (!prompt.trim()) return;

    if (!navigator.onLine) {
      setNetworkToast({
        type: 'offline',
        message: '인터넷 연결이 끊겨 오프라인 스마트 대본 생성 모드로 작성됩니다.',
      });
    }

    setIsGeneratingScript(true);
    try {
      if (window.electronAPI) {
        const generated = await window.electronAPI.generateScript({
          prompt,
          durationSeconds: 55,
          geminiApiKey: settings.geminiApiKey,
          apiKey: settings.openaiApiKey,
          loopMode,
        });
        setScript(generated);
        if (window.electronAPI.splitScriptScenes) {
          try {
            const splitRes = await window.electronAPI.splitScriptScenes({
              script: generated,
              title: prompt,
            });
            if (splitRes && splitRes.length > 0) {
              setScenes(splitRes);
            }
          } catch {}
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(`⚠️ 대본 생성 중 예외가 발생했습니다.\n${e?.message || e}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleStartRender = async () => {
    if (!prompt.trim() && !script.trim()) return;

    if (!navigator.onLine) {
      alert('⚠️ 인터넷 연결이 끊겨 있습니다.\n\nAI 음성 합성 및 최신 비주얼 생성을 위해 네트워크 연결 상태를 확인하신 후 다시 시도해주세요.');
      return;
    }

    // Token enforcement: Non-admins must have >= 100 tokens, admin is infinite
    if (!user?.isAdmin) {
      if (tokens < 100) {
        alert(
          `⚠️ [포인트 부족 안내]\n\n` +
          `포인트를 모두 소진하셨거나 보유 포인트가 100P 미만(${tokens.toLocaleString()} P)으로 쇼츠를 제작할 수 없습니다.\n\n` +
          `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
          `• 현재 보유 포인트: ${tokens.toLocaleString()} P\n\n` +
          `구매하신 곳(판매자)에 문의하여 토큰을 충전해주세요.`
        );
        setIsTokenRechargeModalOpen(true);
        return;
      }
      // 실제 차감(서버 선차감)·실패 시 환불은 메인 프로세스가 제작 직전에 처리한다.
    }

    setIsRendering(true);
    setRenderErrorDetails(undefined);
    setRenderStatus('generating_script');
    setRenderProgress(10);
    setRenderMessage('쇼츠 제작 준비 중...');

    const projectId = 'proj-' + Date.now();
    const newProject: ShortsProject = {
      id: projectId,
      title: prompt.trim() || '새로운 쇼츠 프로젝트',
      prompt: prompt.trim(),
      script: script.trim(),
      voiceId,
      templateId,
      fontId,
      subtitleStyleId,
      subtitleFontSize,
      titleStyleId,
      durationSeconds,
      status: 'generating_script',
      progressPercent: 10,
      statusMessage: '쇼츠 제작 준비 중...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 대본을 직접 고친 뒤라면 장면 타임라인(장면별 이미지 묘사)이 예전 대본 그대로일 수 있다.
      // 장면 글을 합친 것이 지금 대본과 다르면 지금 대본으로 장면을 다시 나눈다 (예전 묘사로 엉뚱한 이미지가 나오지 않도록).
      let scenesForRender: ScriptScene[] | undefined = scenes.length > 0 ? scenes : undefined;
      const looseText = (t: string) => (t || '').replace(/[^0-9A-Za-z\uAC00-\uD7A3]/g, '');
      const scenesMatchScript = (list: ScriptScene[]) => {
        const body = looseText(script);
        const [first, ...rest] = list;
        // 첫 장면은 썸네일 후킹 문구(제목)로 바뀌어 있을 수 있다
        const firstOk = !first || body.includes(looseText(first.text)) || looseText(first.text) === looseText(prompt);
        const restText = looseText(rest.map((sc) => sc.text).join(''));
        return firstOk && (restText === '' || body.includes(restText));
      };
      if (scenesForRender && script.trim() && !scenesMatchScript(scenesForRender)) {
        scenesForRender = undefined;
        try {
          const resplit = await window.electronAPI?.splitScriptScenes?.({ script: script.trim(), title: prompt.trim() });
          if (resplit && resplit.length > 0) {
            scenesForRender = resplit;
            setScenes(resplit);
          }
        } catch {}
      }
      if (window.electronAPI) {
        const result = await window.electronAPI.renderShorts({
          id: projectId,
          title: newProject.title,
          prompt: newProject.prompt,
          script: script.trim(),
          voiceId,
          templateId,
          fontId,
          subtitleStyleId,
          subtitleFontSize,
          titleStyleId,
          durationSeconds,
          bgmMood,
          bgmVolume,
          enableBgm,
          enableHookIntro,
          enablePopupSubtitles,
          enableSfx,
          sfxVolume,
          enableStockVideo,
          loopMode,
          enableKaraoke: enableKaraoke || subtitleStyleId === 'karaoke',
          enableEmojiStickers,
          voiceSpeed,
          subtitleMotionType,
          highlightKeywords,
          syncHighlightSfx,
          transitionType,
          customScenes: scenesForRender,
        });

        newProject.status = 'done';
        newProject.progressPercent = 100;
        newProject.statusMessage = '쇼츠 제작 완료!';
        newProject.videoPath = result.videoPath;
        newProject.videoUrl = result.videoUrl;

        await window.electronAPI.saveProject(newProject);
        setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== projectId)]);
        setCurrentProject(newProject);
        setIsVideoModalOpen(true);

        // Auto-Upload to YouTube if enabled in settings
        if (settings.youtubeAutoUpload && settings.youtubeClientId && result.videoPath) {
          console.log('[Auto-Upload] Triggering automatic YouTube upload...');
          window.electronAPI
            .uploadToYoutube({
              videoPath: result.videoPath,
              title: newProject.title || newProject.prompt,
              description: newProject.script || newProject.prompt,
              tags: ['Shorts', '쇼츠', 'AI쇼츠', '꿀팁'],
              privacyStatus: 'public',
              autoComment: settings.youtubeAutoComment,
              commentText: settings.youtubeCommentText,
            })
            .then((upRes) => {
              if (upRes.success && upRes.videoUrl) {
                console.log('[Auto-Upload] Successfully uploaded to YouTube:', upRes.videoUrl);
              } else if (!upRes.success) {
                console.warn('[Auto-Upload Warning]:', upRes.error);
                alert(`⚠️ [유튜브 자동 업로드 실패]\n${upRes.error || '알 수 없는 오류'}\n\n[플랫폼 연동] 메뉴에서 구글 OAuth 토큰 상태를 확인해주세요.`);
              }
              if (upRes.commentPosted) {
                console.log('[Auto-Upload] Comment successfully posted for video:', upRes.videoId);
              } else if (upRes.commentError) {
                console.warn('[Auto-Upload] Comment warning:', upRes.commentError);
              }
            })
            .catch((upErr) => {
              console.warn('[Auto-Upload Error]:', upErr);
              alert(`⚠️ [유튜브 자동 업로드 오류]\n${upErr?.message || upErr}`);
            });
        }
      }
    } catch (err: any) {
      console.error('Render error:', err);
      const errMsg = err?.message || String(err);
      setRenderStatus('error');
      setRenderMessage(errMsg.split('\n')[0] || '영상 렌더링 중 오류가 발생했습니다.');
      setRenderErrorDetails(errMsg);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDismissProgress = () => {
    setRenderStatus('draft');
    setRenderProgress(0);
    setRenderMessage('');
    setRenderErrorDetails(undefined);
  };

  const handleDeleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    const title = target?.title || '해당 쇼츠 영상';
    if (!window.confirm(`"${title}" 프로젝트를 정말로 삭제하시겠습니까?`)) {
      return;
    }

    if (window.electronAPI) {
      await window.electronAPI.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) setCurrentProject(null);
    }
  };

  const handleShowInFolder = (path: string) => {
    if (window.electronAPI) {
      window.electronAPI.showInFolder(path);
    }
  };

  const handleOpenVideoFile = (path: string) => {
    if (window.electronAPI) {
      window.electronAPI.openVideoFile(path);
    }
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (window.electronAPI) {
      await window.electronAPI.saveSettings(newSettings);
    }
  };

  const handleSelectOutputDirectory = async () => {
    if (window.electronAPI) {
      return await window.electronAPI.selectOutputDirectory();
    }
    return null;
  };

  const handleApplyPreset = (preset: ShortsPreset) => {
    setVoiceId(preset.voiceId);
    setTemplateId(preset.templateId);
    setFontId(preset.fontId);
    setSubtitleStyleId(preset.subtitleStyleId);
    setSubtitleFontSize(preset.subtitleFontSize);
    setTitleStyleId(preset.titleStyleId);
    setBgmMood(preset.bgmMood);
    setBgmVolume(preset.bgmVolume);
    setEnableBgm(preset.enableBgm);
    setEnableHookIntro(preset.enableHookIntro);
    setEnablePopupSubtitles(preset.enablePopupSubtitles);
  };

  // If not logged in, show User Login / Access screen
  if (!user || !user.isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden select-none font-sans relative">
      {/* Network Connectivity Resilience Notification Toast */}
      {networkToast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all animate-in fade-in slide-in-from-top-3 duration-200 border ${
            networkToast.type === 'offline'
              ? 'bg-amber-600/95 text-white border-amber-500 backdrop-blur-md shadow-amber-900/20'
              : 'bg-emerald-600/95 text-white border-emerald-500 backdrop-blur-md shadow-emerald-900/20'
          }`}
        >
          {networkToast.type === 'offline' ? (
            <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          ) : (
            <Wifi className="w-4 h-4 shrink-0" />
          )}
          <span>{networkToast.message}</span>
          <button
            onClick={() => setNetworkToast(null)}
            className="ml-2 px-1.5 py-0.5 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Left Dark Sidebar Navigation (stays dark as requested) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userName={user.name}
        isAdmin={user.isAdmin}
        licenseKey={user.licenseKey}
        tokens={user.isAdmin ? 999999999 : tokens}
        projectCount={projects.length}
        onLogout={handleLogout}
        onOpenUpdate={() => setIsUpdateModalOpen(true)}
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
        onOpenRechargeModal={() => setIsTokenRechargeModalOpen(true)}
        hasUpdate={updateInfo?.hasUpdate}
        latestVersion={updateInfo?.latestVersion}
        currentVersion={updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0')}
      />

      {/* 2. Main Bright Studio Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f8fafc]">
        {/* Top Clean Navbar */}
        <header className="h-16 px-8 border-b border-slate-200/90 bg-white flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              {currentTab === 'dashboard' && '대시보드 개요'}
              {currentTab === 'create' && 'AI 쇼츠 자동 제작 스튜디오'}
              {currentTab === 'video-to-shorts' && '🎬 사용자 영상 분석 쇼츠 제작 스튜디오'}
              {currentTab === 'autopilot' && 'AI 오토파일럿 완전 자동 예약 발행'}
              {currentTab === 'ai-settings' && 'AI 모델 및 API 설정'}
              {currentTab === 'projects' && '작성글 및 비디오 보관함'}
              {currentTab === 'templates' && '템플릿 및 보이스 프리셋'}
              {currentTab === 'publish' && '유튜브 자동 연동 및 발행'}
              {currentTab === 'help' && '도움말 및 가이드'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsUpdateModalOpen(true);
                setIsToastDismissed(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm relative ${
                updateInfo?.hasUpdate
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80'
              }`}
              title={
                updateInfo?.hasUpdate
                  ? `새로운 업데이트 v${updateInfo.latestVersion || '1.4.0'}`
                  : `현재 버전 v${updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0')}`
              }
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updateInfo?.hasUpdate ? 'text-white animate-spin' : 'text-blue-600'}`} />
              <span>
                {updateInfo?.hasUpdate
                  ? `v${updateInfo.latestVersion || '1.4.0'} 업데이트`
                  : `업데이트 (v${updateInfo?.currentVersion || (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.4.0')})`}
              </span>
              {updateInfo?.hasUpdate && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('create')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Video className="w-3.5 h-3.5" />
              <span>새 쇼츠 만들기</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8fafc]">
          <Suspense fallback={<PageLoadingFallback />}>
            {/* Dashboard Tab */}
            {currentTab === 'dashboard' && (
              <DashboardHome
                userName={user.name}
                projects={projects}
                settings={settings}
                onNavigate={setCurrentTab}
                onSelectProject={(p) => {
                  setCurrentProject(p);
                  setIsVideoModalOpen(true);
                }}
                onOpenBatchModal={() => setIsBatchModalOpen(true)}
                onOpenLongToShortsModal={() => setIsLongToShortsModalOpen(true)}
                onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
              />
            )}

            {/* Create Shorts Tab */}
            {currentTab === 'create' && (
              <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
                {/* Render Progress Overlay / Card */}
                <RenderProgress
                  status={renderStatus}
                  progressPercent={renderProgress}
                  statusMessage={renderMessage}
                  errorDetails={renderErrorDetails}
                  onDismiss={handleDismissProgress}
                />

                {/* Step 0: One-Click Quick Presets Bar */}
                <PresetBar
                  currentVoiceId={voiceId}
                  currentTemplateId={templateId}
                  currentFontId={fontId}
                  currentSubtitleStyleId={subtitleStyleId}
                  currentSubtitleFontSize={subtitleFontSize}
                  currentTitleStyleId={titleStyleId}
                  currentBgmMood={bgmMood}
                  currentBgmVolume={bgmVolume}
                  enableBgm={enableBgm}
                  enableHookIntro={enableHookIntro}
                  enablePopupSubtitles={enablePopupSubtitles}
                  onApplyPreset={handleApplyPreset}
                />

                {/* Step 1: Prompt Input */}
                <PromptSection
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onGenerateScript={handleGenerateScript}
                  isGeneratingScript={isGeneratingScript}
                  loopMode={loopMode}
                  setLoopMode={setLoopMode}
                />

                {/* Step 1-2: AI Thumbnail & 3s Hook A/B Test Optimizer */}
                <ThumbnailABEditor
                  topic={prompt}
                  scenes={scenes}
                  onChangeScenes={setScenes}
                  onApplyTitleAndHook={(newTitle, newHookIntro, heroVisual) => {
                    setPrompt(newTitle);
                    // Trigger prompt-based script regeneration if user desires
                  }}
                />

                {/* Step 2: Script Editor */}
                <ScriptEditor
                  script={script}
                  setScript={setScript}
                  title={prompt}
                  onChangeTitle={setPrompt}
                  scenes={scenes}
                  onChangeScenes={setScenes}
                  onChangeVoiceId={setVoiceId}
                />

                {/* Step 3: Korean Voice Selection */}
                <VoiceSelector
                  selectedVoiceId={voiceId}
                  onSelectVoice={setVoiceId}
                  voiceSpeed={voiceSpeed}
                  onChangeVoiceSpeed={setVoiceSpeed}
                />

                {/* Step 3-2: Commercial-Free Korean Font Selection */}
                <FontSelector selectedFontId={fontId} onSelectFont={setFontId} />

                {/* Step 3-3: Modern Viral Subtitle & Title Style Selection */}
                <SubtitleStyleSelector
                  selectedSubtitleStyle={subtitleStyleId}
                  onSelectSubtitleStyle={setSubtitleStyleId}
                  selectedFontSize={subtitleFontSize}
                  onSelectFontSize={setSubtitleFontSize}
                  selectedTitleStyle={titleStyleId}
                  onSelectTitleStyle={setTitleStyleId}
                  enableEmojiStickers={enableEmojiStickers}
                  onToggleEmojiStickers={setEnableEmojiStickers}
                  selectedMotionType={subtitleMotionType}
                  onSelectMotionType={setSubtitleMotionType}
                  highlightKeywords={highlightKeywords}
                  onToggleHighlightKeywords={setHighlightKeywords}
                />

                {/* Step 4: Video Template Selection */}
                <TemplateSelector
                  selectedTemplateId={templateId}
                  onSelectTemplate={setTemplateId}
                  onOpenSettings={() => setCurrentTab('ai-settings')}
                  currentEngine={settings.imageEngine}
                  enableStockVideo={enableStockVideo}
                  onToggleStockVideo={setEnableStockVideo}
                  hasPexelsKey={Boolean(settings.pexelsApiKey)}
                  transitionType={transitionType}
                  onChangeTransitionType={setTransitionType}
                />

                {/* Step 5: BGM & Smart Audio Ducking & Hook Retention */}
                <BgmSelector
                  selectedMood={bgmMood}
                  onSelectMood={setBgmMood}
                  bgmVolume={bgmVolume}
                  onChangeVolume={setBgmVolume}
                  enableBgm={enableBgm}
                  onToggleBgm={setEnableBgm}
                  enableHookIntro={enableHookIntro}
                  onToggleHookIntro={setEnableHookIntro}
                  enablePopupSubtitles={enablePopupSubtitles}
                  onTogglePopupSubtitles={setEnablePopupSubtitles}
                  enableSfx={enableSfx}
                  onToggleSfx={setEnableSfx}
                  sfxVolume={sfxVolume}
                  onChangeSfxVolume={setSfxVolume}
                  currentTopic={prompt}
                  syncHighlightSfx={syncHighlightSfx}
                  onToggleHighlightSfx={setSyncHighlightSfx}
                />

                {/* Floating Bottom Action Bar */}
                <div className="sticky bottom-0 z-20 pt-2 pb-2">
                  <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 space-y-0.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-800">
                          {VOICES.find((v) => v.id === voiceId)?.name || '선희'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-indigo-600 font-extrabold">
                          {(() => {
                            const matchedFont = FONTS.find(
                              (f) =>
                                f.id === fontId ||
                                f.id.replace(/\s+/g, '').toLowerCase() === (fontId || 'Pretendard').replace(/\s+/g, '').toLowerCase()
                            );
                            return matchedFont?.name ? matchedFont.name.split('(')[0].trim() : (fontId || '프리탠다드');
                          })()}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-pink-600 font-extrabold">
                          자막: {SUBTITLE_STYLES.find((s) => s.id === subtitleStyleId)?.name?.split('&')[0]?.trim() || '미스터비스트'} ({subtitleFontSize === 'small' ? '보통' : subtitleFontSize === 'large' ? '아주크게' : subtitleFontSize === 'xlarge' ? '초대형' : '크게'})
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-extrabold">
                          제목: {TITLE_STYLES.find((t) => t.id === titleStyleId)?.name?.split('(')[0]?.trim() || '노란 테이프'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700 font-bold">
                          {TEMPLATES.find((t) => t.id === templateId)?.name || '기본 모던'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-600 font-black">1080x1920 (9:16) FHD</span>
                        {!user?.isAdmin && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span
                              className={`font-extrabold flex items-center gap-1 ${
                                tokens < 100 ? 'text-rose-600 animate-pulse font-black' : 'text-amber-600'
                              }`}
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>
                                보유 {tokens.toLocaleString()} P (쇼츠당 100P)
                                {tokens < 100 && ' ⚠️ 제작 불가'}
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        버튼을 누르면 음성·이미지·자막 합성이 시작됩니다. (장면 수와 이미지 엔진에 따라 수 분 소요)
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                      {!user?.isAdmin && tokens < 100 && (
                        <button
                          type="button"
                          onClick={() => setIsTokenRechargeModalOpen(true)}
                          className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <Coins className="w-4 h-4" />
                          <span>포인트 충전</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (!user?.isAdmin && tokens < 100) {
                            alert(
                              `⚠️ [포인트 부족 안내]\n\n` +
                              `포인트를 모두 소진하셨거나 보유 포인트가 100P 미만(${tokens.toLocaleString()} P)으로 쇼츠를 제작할 수 없습니다.\n\n` +
                              `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
                              `• 현재 보유 포인트: ${tokens.toLocaleString()} P\n\n` +
                              `구매하신 곳(판매자)에 문의하여 토큰을 충전해주세요.`
                            );
                            setIsTokenRechargeModalOpen(true);
                            return;
                          }
                          handleStartRender();
                        }}
                        disabled={isRendering || (!prompt.trim() && !script.trim())}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shrink-0 w-full sm:w-auto justify-center ${
                          !user?.isAdmin && tokens < 100
                            ? 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-amber-500/25'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-500/25'
                        }`}
                      >
                        {isRendering ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>쇼츠 렌더링 중...</span>
                          </>
                        ) : !user?.isAdmin && tokens < 100 ? (
                          <>
                            <Coins className="w-4 h-4" />
                            <span>포인트 부족 ({tokens.toLocaleString()}P / 100P 필요)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>원클릭 쇼츠 비디오 렌더링 시작</span>
                            {!user?.isAdmin && (
                              <span className="ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-white/90">
                                -100P
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video-to-Shorts Analysis Studio Tab */}
            {currentTab === 'video-to-shorts' && (
              <VideoToShortsPage
                onNavigate={setCurrentTab}
                onProjectCreated={() => {
                  window.electronAPI.getProjects().then(setProjects).catch(console.error);
                  void window.electronAPI.refreshLicense?.();
                }}
              />
            )}

            {/* Auto-Pilot Scheduler Tab */}
            {currentTab === 'autopilot' && (
              <AutoPilotPage
                settings={settings}
                onNavigateToProjects={() => setCurrentTab('projects')}
                onNavigateToPublish={() => setCurrentTab('publish')}
              />
            )}

            {/* AI Settings Tab */}
            {currentTab === 'ai-settings' && (
              <AISettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onSelectOutputDirectory={handleSelectOutputDirectory}
                onNavigateToPublish={() => setCurrentTab('publish')}
              />
            )}

            {/* Projects Management Tab */}
            {currentTab === 'projects' && (
              <ProjectManagementPage
                projects={projects}
                onSelectProject={(p) => {
                  setCurrentProject(p);
                  setIsVideoModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
                onShowInFolder={handleShowInFolder}
                onOpenVideoFile={handleOpenVideoFile}
                onNavigateToCreate={() => setCurrentTab('create')}
              />
            )}

            {/* Templates & Presets Management Hub Tab */}
            {currentTab === 'templates' && (
              <PresetsManagementPage
                onApplyPresetAndNavigate={(preset) => {
                  handleApplyPreset(preset);
                  setCurrentTab('create');
                }}
                onNavigate={setCurrentTab}
                currentVoiceId={voiceId}
                onChangeVoiceId={setVoiceId}
                currentTemplateId={templateId}
                onChangeTemplateId={setTemplateId}
                currentImageEngine={settings.imageEngine}
              />
            )}

            {/* Publish / YouTube Tab */}
            {currentTab === 'publish' && (
              <PublishPage settings={settings} onSaveSettings={handleSaveSettings} />
            )}

            {/* Help Tab */}
            {currentTab === 'help' && <HelpGuidePage onNavigate={setCurrentTab} />}

          </Suspense>
        </main>
      </div>

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        {/* Video Modal */}
        {isVideoModalOpen && (
          <VideoPlayerModal
            isOpen={isVideoModalOpen}
            project={currentProject}
            onClose={() => setIsVideoModalOpen(false)}
            onShowInFolder={handleShowInFolder}
            onOpenVideoFile={handleOpenVideoFile}
          />
        )}

        {/* History Modal */}
        {isHistoryOpen && (
          <ProjectHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            projects={projects}
            onSelectProject={(p) => {
              setCurrentProject(p);
              setIsVideoModalOpen(true);
            }}
            onDeleteProject={handleDeleteProject}
            onShowInFolder={handleShowInFolder}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onSelectOutputDirectory={handleSelectOutputDirectory}
            onNavigateToPublish={() => setCurrentTab('publish')}
          />
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && (
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            isUpdating={isUpdating}
            updateStatus={updateStatus}
            updateResult={updateResult}
            updateInfo={updateInfo}
            onStartUpdate={handleStartUpdate}
          />
        )}

        {/* Excel/CSV Batch Bulk Generator Modal */}
        {isBatchModalOpen && (
          <BatchGeneratorModal
            isOpen={isBatchModalOpen}
            onClose={() => setIsBatchModalOpen(false)}
            onBatchDone={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        {/* Long-to-Shorts Video Clipper Modal */}
        {isLongToShortsModalOpen && (
          <LongToShortsModal
            isOpen={isLongToShortsModalOpen}
            onClose={() => setIsLongToShortsModalOpen(false)}
            onClipExtracted={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        {/* Shorts Publish Calendar & Distribute Modal */}
        {isCalendarModalOpen && (
          <PublishCalendarModal
            isOpen={isCalendarModalOpen}
            onClose={() => setIsCalendarModalOpen(false)}
            projects={projects}
            onScheduleUpdated={() => {
              if (window.electronAPI) {
                window.electronAPI.getProjects().then(setProjects).catch(console.error);
              }
            }}
          />
        )}

        {/* Token Recharge Modal */}
        <TokenRechargeModal
          isOpen={isTokenRechargeModalOpen}
          onClose={() => setIsTokenRechargeModalOpen(false)}
          status={licenseStatus}
          isAdmin={user.isAdmin}
          onActivated={(s) => {
            applyLicenseStatus(s);
            setUser((u) => (u ? { ...u, licenseKey: s.keyHint } : u));
          }}
        />
      </Suspense>

      {/* In-App Push Notification Toast when update is found */}
      {!isToastDismissed && (
        <UpdateNotificationToast
          updateInfo={updateInfo}
          onOpenUpdate={() => {
            setIsUpdateModalOpen(true);
            setIsToastDismissed(true);
          }}
          onDismiss={() => setIsToastDismissed(true)}
        />
      )}
    </div>
  );
}
