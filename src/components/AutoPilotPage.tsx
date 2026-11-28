import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  Clock,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Video,
  Share2,
  MessageSquare,
  Save,
  Check,
  ExternalLink,
  Bot,
  Zap,
  Calendar,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  Flame,
  Music,
  Heading,
} from 'lucide-react';
import type { YouTubePerformanceAnalysis, AppSettings, AutoPilotSchedule, AutoPilotStatusEvent, SubtitleFontSize } from '../types';
import { SUBTITLE_STYLES, TITLE_STYLES } from './SubtitleStyleSelector';
import { ShortsPhonePreview } from './ShortsPhonePreview';
import { TEMPLATES } from './TemplateSelector';

export const HOOK_PRESETS = [
  {
    id: 'tips',
    name: '⚡ 놓치면 손해 3초 꿀팁',
    title: '⚡ 놓치면 손해 3초 꿀팁 ⚡',
    subtitle: '끝까지 보면 인생이 바뀝니다',
    badge: '🔥 1위',
  },
  {
    id: 'breaking',
    name: '🚨 긴급 속보! 충격 주의',
    title: '🚨 긴급 속보! 충격 주의 🚨',
    subtitle: '지금 바로 확인하지 않으면 후회합니다',
    badge: '🚨 클릭률',
  },
  {
    id: 'secret',
    name: '🤫 99%는 모르는 비밀',
    title: '🤫 99%는 절대 모르는 비밀 🤫',
    subtitle: '상위 1%만 아는 현실 전격 공개',
    badge: '💡 호기심',
  },
  {
    id: 'curiosity',
    name: '❓ 혹시 나도 해당될까?',
    title: '❓ 혹시 나도 해당될까? ❓',
    subtitle: '1초 만에 자가진단 해보세요',
    badge: '📌 공감',
  },
  {
    id: 'money',
    name: '💰 돈 버는 사람들의 특징',
    title: '💰 돈 버는 사람들의 특징 💰',
    subtitle: '이것 모르면 평생 손해봅니다',
    badge: '💵 재테크',
  },
  {
    id: 'custom',
    name: '✏️ 직접 입력 (커스텀 문구)',
    title: '',
    subtitle: '',
    badge: '자유',
  },
];

interface AutoPilotPageProps {
  settings: AppSettings;
  onNavigateToProjects: () => void;
  onNavigateToPublish?: () => void;
}

const PRESET_NICHES = [
  { label: '😱 공포 실화 & 미스터리 괴담', value: '등골이 오싹한 실제 경험담 공포 실화와 소름 돋는 미스터리 괴담' },
  { label: '🛸 초자연 현상 & UFO/외계인', value: '현대 과학으로 설명 불가능한 불가사의한 초자연 현상과 기이한 사건' },
  { label: '🕵️ 스릴러 & 미제 범죄 사건', value: '전 세계를 경악하게 만든 풀리지 않은 미스터리 미제 사건과 스릴러 비화' },
  { label: '💡 생활 꿀팁 & 살림 비법', value: '일상 생활에서 즉시 써먹는 놀라운 살림 꿀팁과 지혜' },
  { label: '📜 역사 미스터리 & 썰', value: '역사 속 충격적이고 흥미진진한 비화 및 미스터리' },
  { label: '🌿 건강 상식 & 일상 습관', value: '의사들도 챙겨하는 기적의 일상 건강 및 식습관 상식' },
  { label: '💰 부자 습관 & 재테크', value: '상위 1% 성공한 사람들과 부자들의 결정적인 일상 습관' },
  { label: '🧠 실전 심리학 & 인간관계', value: '사람의 마음을 읽고 말 한마디로 호감을 얻는 실전 심리학' },
  { label: '💼 직장인 공감 & 칼퇴 팁', value: '직장 생활 스트레스 극복 및 시간 관리 생산성 꿀팁' },
  { label: '📱 IT & 스마트폰 꿀기능', value: '아이폰/갤럭시와 컴퓨터의 숨겨진 유용한 치트키 및 무료 사이트' },
  { label: '🐾 반려동물(강아지/고양이)', value: '반려견과 반려묘의 신비한 행동 심리와 건강 상식' },
  { label: '🍳 초간단 3분 요리 & 레시피', value: '전자레인지와 에어프라이어로 만드는 초간단 꿀맛 레시피' },
  { label: '🌌 우주 과학 & 신비한 자연', value: '블랙홀, 심해 생물 등 상상을 초월하는 신비한 과학 팩트' },
  { label: '🚗 자동차 관리 & 운전 꿀팁', value: '기름값 아끼는 법과 안전 운전 및 차량 관리 필수 지식' },
  { label: '✈️ 여행 꿀팁 & 항공권 예매', value: '항공권 30% 저렴하게 예매하는 법과 여행 패킹 꿀팁' },
  { label: '🧙 도시전설 & 기괴한 진실', value: '인터넷과 전 세계에 떠도는 소름 끼치는 도시전설과 그 이면' },
  { label: '📰 실시간 핫이슈 & 뉴스 브리핑', value: '오늘 꼭 알아야 할 1분 실시간 핵심 핫이슈와 경제/사회 속보' },
  { label: '💬 커뮤니티 & 블라인드 레전드 썰', value: '익명 커뮤니티(블라인드, 판, 에펨)를 발칵 뒤집은 역대급 사연 레전드' },
  { label: '🏋️ 홈트 & 체형 교정 1분 운동', value: '거북목과 뱃살을 타파하는 하루 1분 초간단 홈트 루틴' },
  { label: '🎬 영화/드라마 숨은 비하인드', value: '명작 영화 속에 숨겨진 소름 돋는 복선과 촬영장 비하인드' },
  { label: '🗣️ 원어민 영어 회화 & 슬랭', value: '미드에 매일 나오는 원어민 실전 표현과 뉘앙스 차이' },
  { label: '🤯 인체 & 뇌과학 반전 팩트', value: '의사들도 놀란 인체와 뇌의 기이한 반응 및 흑역사/수면 심리' },
  { label: '🌍 세계의 충격 문화 & 황당 법률', value: '외국인이 들으면 경악하는 전 세계의 기상천외한 법률과 문화 충격' },
  { label: '💎 억만장자 & 천재 마케팅 비화', value: '애플, 스타벅스, 나이키 등 글로벌 1위 기업들의 소름 돋는 마케팅 수법과 부의 비밀' },
  { label: '🤖 미래 사회 & AI 충격 진실', value: '2030 사라질 직업과 인공지능이 바꿀 미래의 충격적인 모습' },
];

function formatTimeLabel(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? '오후' : '오전';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const paddedM = String(m || 0).padStart(2, '0');
  return `${period} ${displayH}시 ${paddedM}분 (${String(h).padStart(2, '0')}:${paddedM})`;
}

function getTimeUntilNextRun(nextRunAt?: string): string {
  if (!nextRunAt) return '설정 대기 중';
  const target = new Date(nextRunAt).getTime();
  const diffMs = target - Date.now();
  if (diffMs <= 0) return '곧 자동 실행됩니다!';
  
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours > 0) {
    return `약 ${diffHours}시간 ${remainingMinutes}분 후 실행 예정`;
  }
  return `약 ${diffMinutes}분 후 실행 예정`;
}

export const AutoPilotPage: React.FC<AutoPilotPageProps> = ({ settings, onNavigateToProjects, onNavigateToPublish }) => {
  const [perf, setPerf] = useState<YouTubePerformanceAnalysis | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState('');
  const handleAnalyzePerformance = async () => {
    if (!window.electronAPI?.analyzeYoutubePerformance) return;
    setPerfLoading(true);
    setPerfError('');
    try {
      const res = await window.electronAPI.analyzeYoutubePerformance();
      if (res.success && res.data) setPerf(res.data);
      else setPerfError(res.error || '성과 분석에 실패했습니다.');
    } catch (e: any) {
      setPerfError(e?.message || String(e));
    } finally {
      setPerfLoading(false);
    }
  };

  const [config, setConfig] = useState<AutoPilotSchedule>({
    enabled: false,
    scheduleTime: '18:00',
    frequency: 'daily',
    customIntervalValue: 4,
    channelNiche: '일상 생활에서 즉시 써먹는 놀라운 살림 꿀팁과 지혜',
    customInstruction: '',
    durationSeconds: 55,
    titleStyleId: 'yellow_tape',
    subtitleStyleId: 'mrbeast',
    enableHookIntro: true,
    hookIntroPreset: 'tips',
    hookTitleText: '⚡ 놓치면 손해 3초 꿀팁 ⚡',
    hookSubtitleText: '끝까지 보면 인생이 바뀝니다',
    autoUploadYoutube: true,
    autoComment: true,
    commentText: settings.youtubeCommentText || '📌 더 많은 꿀팁과 상세 정보는 프로필 링크를 확인해주세요! 구독과 좋아요는 큰 힘이 됩니다.',
    history: [],
  });

  const [saved, setSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExecutingNow, setIsExecutingNow] = useState(false);
  const [isCommentScopeModalOpen, setIsCommentScopeModalOpen] = useState(false);
  useEscapeKey(isCommentScopeModalOpen, () => setIsCommentScopeModalOpen(false));
  const [liveStatus, setLiveStatus] = useState<AutoPilotStatusEvent | null>(null);
  const [triggerResult, setTriggerResult] = useState<{ success: boolean; message: string; videoUrl?: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock ticker for current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch / Refresh Config Function (full refresh only on initial load or manual refresh button)
  const fetchConfig = async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      if (window.electronAPI?.getAutoPilotConfig) {
        const loaded = await window.electronAPI.getAutoPilotConfig();
        if (loaded) {
          setConfig((prev) => ({
            ...prev,
            ...loaded,
            titleStyleId: loaded.titleStyleId || prev.titleStyleId || settings.defaultTitleStyleId || 'yellow_tape',
            subtitleStyleId: loaded.subtitleStyleId || prev.subtitleStyleId || settings.defaultSubtitleStyleId || 'mrbeast',
            enableHookIntro: loaded.enableHookIntro ?? prev.enableHookIntro ?? true,
            hookIntroPreset: loaded.hookIntroPreset || prev.hookIntroPreset || 'tips',
            hookTitleText: loaded.hookTitleText || prev.hookTitleText || '⚡ 놓치면 손해 3초 꿀팁 ⚡',
            hookSubtitleText: loaded.hookSubtitleText || prev.hookSubtitleText || '끝까지 보면 인생이 바뀝니다',
            commentText: loaded.commentText || settings.youtubeCommentText || prev.commentText,
          }));
        }
      }
    } catch (err) {
      console.warn('[AutoPilot Fetch Error]:', err);
    } finally {
      if (showSpin) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Initial Load & Listen for Live Status (without aggressive 5s polling that wiped inputs)
  useEffect(() => {
    fetchConfig();

    if (window.electronAPI?.onAutoPilotStatus) {
      const unsub = window.electronAPI.onAutoPilotStatus((status) => {
        setLiveStatus(status);
        setIsExecutingNow(status.isRunning);
        if (status.currentStep === 'done' || (!status.isRunning && status.historyItem)) {
          fetchConfig();
        }
      });
      return () => {
        unsub();
      };
    }
  }, [settings.youtubeCommentText]);

  const handleSaveConfig = async (newConfig?: AutoPilotSchedule) => {
    const toSave = newConfig || config;
    if (window.electronAPI?.saveAutoPilotConfig) {
      const updated = await window.electronAPI.saveAutoPilotConfig(toSave);
      setConfig(updated);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Immediate auto-save handlers so user choices are never lost or reverted
  const handleScheduleTimeChange = (newTime: string) => {
    const updated = { ...config, scheduleTime: newTime };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleFrequencyChange = (newFreq: any) => {
    const updated = { ...config, frequency: newFreq };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleCustomIntervalChange = (val: number) => {
    const updated = { ...config, customIntervalValue: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleToggleEnabled = async () => {
    const nextEnabled = !config.enabled;
    const updated = { ...config, enabled: nextEnabled };
    setConfig(updated);

    if (!nextEnabled) {
      // 예약 끄기 -> 진행 중이던 모든 오토파일럿/렌더링 작업 즉각 STOP
      setIsExecutingNow(false);
      setLiveStatus(null);
      if (window.electronAPI?.stopAutoPilot) {
        try {
          await window.electronAPI.stopAutoPilot();
        } catch (e) {
          console.error('[stopAutoPilot error]:', e);
        }
      } else {
        await handleSaveConfig(updated);
      }
    } else {
      await handleSaveConfig(updated);
    }
  };

  const handleToggleAutoUpload = (val: boolean) => {
    const updated = { ...config, autoUploadYoutube: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleToggleAutoComment = (val: boolean) => {
    const updated = { ...config, autoComment: val };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const handleCleanCommentWarnings = () => {
    const cleaned = (config.history || []).map((h) => ({
      ...h,
      commentStatus: h.commentStatus === 'failed' ? ('skipped' as const) : h.commentStatus,
      commentError: undefined,
    }));
    const updated = { ...config, history: cleaned };
    setConfig(updated);
    handleSaveConfig(updated);
  };

  const hasCommentScopeWarning = (config.history || []).some(
    (h) => h.commentStatus === 'failed' && (h.commentError?.includes('youtube.force-ssl') || h.commentError?.includes('권한'))
  );

  const handleTriggerNow = async () => {
    if (isExecutingNow) return;

    // Check token balance for non-admin creators
    try {
      const authStr = localStorage.getItem('kshorts_auth');
      let isAdmin = false;
      if (authStr) {
        const parsed = JSON.parse(authStr);
        isAdmin = Boolean(parsed.isAdmin);
      }
      const tokenStr = localStorage.getItem('kshorts_tokens');
      const currentTokens = tokenStr ? parseInt(tokenStr, 10) : 0;
      if (!isAdmin && currentTokens < 100) {
        alert(
          `⚠️ [포인트 부족 안내]\n\n` +
          `포인트를 모두 소진하셨거나 잔여 포인트가 100P 미만(${currentTokens.toLocaleString()} P)으로 오토파일럿 쇼츠를 제작할 수 없습니다.\n\n` +
          `• 쇼츠 1편 제작 필요 포인트: 100 P\n` +
          `• 현재 보유 포인트: ${currentTokens.toLocaleString()} P\n\n` +
          `사이드바의 [+충전] 버튼 또는 관리자에게 문의하여 포인트를 충전해주세요.`
        );
        return;
      }
    } catch {}

    setIsExecutingNow(true);
    setTriggerResult(null);

    try {
      if (window.electronAPI?.triggerAutoPilotNow) {
        const res = await window.electronAPI.triggerAutoPilotNow();
        if (res.success) {
          setTriggerResult({
            success: true,
            message: `"${res.topic}" 주제로 쇼츠 제작 및 발행이 완료되었습니다!`,
            videoUrl: res.videoUrl,
          });
          await fetchConfig();
        } else {
          setTriggerResult({
            success: false,
            message: res.error || '자율 발행 실행 중 오류가 발생했습니다.',
          });
        }
      }
    } catch (err: any) {
      setTriggerResult({
        success: false,
        message: err?.message || String(err),
      });
    } finally {
      setIsExecutingNow(false);
    }
  };

  const hasYoutubeConnected = Boolean(settings.youtubeClientId && settings.youtubeRefreshToken);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-200 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>AI 오토파일럿(Auto-Pilot) 완전 자동 예약 발행</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                100% 무인 자동화
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              인공지능이 주제 발굴부터 대본 작성, 음성/영상 렌더링, 유튜브 업로드 및 첫 댓글까지 예약된 시간에 알아서 수행합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Button */}
          <button
            onClick={() => fetchConfig(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="스케줄 상태 및 발행 이력 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span>새로고침</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => handleSaveConfig()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? '설정 저장 완료' : '설정 저장'}</span>
          </button>
        </div>
      </div>

      {/* Main Status & Action Hero Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        config.enabled
          ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-500/30 shadow-xl shadow-purple-900/10'
          : 'bg-white text-slate-900 border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full ${config.enabled ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'}`} />
              <span className={`text-xs font-extrabold uppercase tracking-wider ${config.enabled ? 'text-purple-200' : 'text-slate-500'}`}>
                {config.enabled ? '오토파일럿 가동 중 (활성화)' : '오토파일럿 대기 중 (비활성화)'}
              </span>
              <span className="text-slate-400 text-xs">• 현재 시각: <b className="text-white font-mono">{currentTime || '--:--:--'}</b></span>
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {config.enabled
                ? `${formatTimeLabel(config.scheduleTime)} 기준, 설정된 주기에 맞춰 새로운 쇼츠가 전자동 발행됩니다.`
                : '스케줄러를 켜면 AI가 지정된 시간에 스스로 쇼츠를 발행합니다.'}
            </h2>

            <div className={`text-xs flex items-center gap-4 font-medium flex-wrap ${config.enabled ? 'text-slate-300' : 'text-slate-500'}`}>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-yellow-300" />
                <span>다음 발행: <b>{config.nextRunAt ? new Date(config.nextRunAt).toLocaleString() : '미정'}</b></span>
                <span className="text-yellow-300 font-bold ml-1">({getTimeUntilNextRun(config.nextRunAt)})</span>
              </span>
              {config.lastRunAt && (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>최근 실행: {new Date(config.lastRunAt).toLocaleTimeString()}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Instant Run Button */}
            <button
              onClick={handleTriggerNow}
              disabled={isExecutingNow}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 ${
                isExecutingNow
                  ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                  : config.enabled
                  ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isExecutingNow ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI 무인 제작 진행 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>지금 즉시 1편 시험 발행</span>
                </>
              )}
            </button>

            {/* Toggle Switch */}
            <button
              onClick={handleToggleEnabled}
              className={`px-4 py-3 rounded-xl text-xs font-black transition-all border ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {config.enabled ? '예약 끄기' : '예약 켜기'}
            </button>
          </div>
        </div>

        {/* Live Status Notification Box */}
        {(liveStatus?.isRunning || triggerResult) && (
          <div className="mt-5 pt-4 border-t border-white/10 text-xs">
            {liveStatus?.isRunning && (
              <div className="p-3.5 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center gap-3 text-purple-100 animate-pulse">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-semibold">{liveStatus.message || 'AI 오토파일럿이 쇼츠를 제작하고 있습니다...'}</span>
              </div>
            )}

            {triggerResult && !liveStatus?.isRunning && (
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                triggerResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  {triggerResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  <span>{triggerResult.message}</span>
                </div>
                {triggerResult.videoUrl && (
                  <a
                    href={triggerResult.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-bold underline hover:text-white"
                  >
                    <span>유튜브 확인</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety Guideline Alert Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 space-y-1.5 shadow-sm">
        <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>유튜브 채널 안전 업로드 한도 & 알고리즘 가이드</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          • <b>유튜브 무료 API 기본 쿼터(10,000pt) 기준</b>: 하루 <b>최대 6편(4시간 간격)</b>이 기본 쿼터 안에서 업로드할 수 있는 대략적인 한도입니다.<br />
          • <b>계정 성장기 권장</b>: 하루 <b>1~3편</b>부터 시작해 반응을 보며 늘리는 것을 권장합니다.<br />
          • 업로드 한도와 정책은 YouTube 사정에 따라 바뀔 수 있습니다.
        </p>
      </div>

      {/* Grid: Settings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Topic Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Schedule Time & Frequency */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-extrabold text-slate-900">1. 예약 발행 시간 및 주기 설정 (최대치 지원)</h2>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {formatTimeLabel(config.scheduleTime)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>기준 시작 시각 (24시간 형식)</span>
                  <span className="text-slate-400 text-[11px] font-medium">현재: {currentTime.slice(0, 5)}</span>
                </label>
                <input
                  type="time"
                  value={config.scheduleTime}
                  onChange={(e) => handleScheduleTimeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-500 font-medium">
                  * 밤 11시는 <b className="text-purple-700">23:00</b>로 표기됩니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">발행 주기 (원하는 빈도 선택)</label>
                <select
                  value={config.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                >
                  <option value="daily">매일 1편 (기준 시각에 1회 발행 - 표준)</option>
                  <option value="twice_daily">매일 2편 (12시간 간격 - 추천)</option>
                  <option value="thrice_daily">매일 3편 (8시간 간격 - 아침/점심/저녁)</option>
                  <option value="every_6h">하루 4편 (6시간마다 1편)</option>
                  <option value="every_4h">하루 6편 (4시간마다 1편 - 🛡️ API 최적 안전 한도)</option>
                  <option value="every_3h">하루 8편 (3시간마다 1편)</option>
                  <option value="every_2h">하루 12편 (2시간마다 1편 - ⚡ 폭풍 성장 최대치)</option>
                  <option value="every_1h">하루 24편 (1시간마다 1편 - 극한 자동화)</option>
                  <option value="custom_hours">⚙️ 직접 설정: N시간 간격</option>
                  <option value="custom_minutes">⚙️ 직접 설정: N분 간격</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium">안전하면서도 강력한 발행 빈도를 마음대로 고를 수 있습니다.</p>
              </div>
            </div>

            {/* Custom Interval Input (Shows when custom option is selected) */}
            {(config.frequency === 'custom_hours' || config.frequency === 'custom_minutes') && (
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-4 animate-in fade-in duration-150">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-purple-900">
                    {config.frequency === 'custom_hours' ? '직접 지정할 시간 간격' : '직접 지정할 분 간격'}
                  </span>
                  <p className="text-[10px] text-purple-600">
                    {config.frequency === 'custom_hours' ? '예: 5시간마다 1편씩 발행' : '예: 45분마다 1편씩 발행 (최소 10분 이상)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={config.frequency === 'custom_hours' ? 1 : 10}
                    max={config.frequency === 'custom_hours' ? 48 : 720}
                    value={config.customIntervalValue || (config.frequency === 'custom_hours' ? 4 : 60)}
                    onChange={(e) => handleCustomIntervalChange(Math.max(1, Number(e.target.value)))}
                    className="w-24 bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-sm font-extrabold text-purple-900 text-center focus:outline-none focus:border-purple-600 shadow-sm"
                  />
                  <span className="text-xs font-bold text-purple-800">
                    {config.frequency === 'custom_hours' ? '시간마다' : '분마다'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Channel Niche & AI Topic Discovery (Expanded Categories) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-extrabold text-slate-900">2. 바이럴 주제 발굴 카테고리 (16개 대확장)</h2>
              </div>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                기존 영상 중복 자동 제외
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>원클릭 카테고리 프리셋 (총 16개 인기 장르)</span>
                  <span className="text-purple-600 text-[10px] font-bold">클릭 시 자동 적용</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {PRESET_NICHES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setConfig({ ...config, channelNiche: preset.value })}
                      className={`px-2.5 py-2 rounded-xl text-left text-[11px] font-bold transition-all border leading-snug ${
                        config.channelNiche === preset.value
                          ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm ring-1 ring-purple-300'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700">채널 메인 테마 / 다루고 싶은 주제 설명 (직접 수정 가능)</label>
                <input
                  type="text"
                  value={config.channelNiche}
                  onChange={(e) => setConfig({ ...config, channelNiche: e.target.value })}
                  placeholder="예: 3040 직장인을 위한 스트레스 해소 꿀팁 및 인간관계 명언"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400 font-medium">
                  AI가 이 분야를 바탕으로 과거에 이미 다룬 주제들을 제외한 채 가장 바이럴될 만한 새로운 주제를 스스로 기획합니다.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">AI 추가 기획 지침 (선택 사항)</label>
                <textarea
                  value={config.customInstruction || ''}
                  onChange={(e) => setConfig({ ...config, customInstruction: e.target.value })}
                  rows={2}
                  placeholder="예: 항상 첫 1초에 충격적인 질문으로 시작해줘, 20대 타깃의 트렌디하고 빠른 말투로 작성해줘 등"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>성과 기반 후속작(2탄) 자동 기획</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      내 채널에서 조회수가 급상승한 영상이 있으면 새 주제 대신 그 영상의 2탄을 우선 기획합니다. 없으면 기존 자율 기획으로 진행합니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={!!config.followUpMode}
                      onChange={(e) => {
                        const updated = { ...config, followUpMode: e.target.checked };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzePerformance}
                  disabled={perfLoading}
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 disabled:opacity-60"
                >
                  {perfLoading ? '분석 중...' : '내 채널 성과 분석해 보기'}
                </button>
                {perfError && <p className="text-[10px] text-red-600 font-medium">{perfError}</p>}
                {perf && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-slate-500">
                      최근 {perf.videoCount}개 영상 · 일평균 조회수 중앙값 {perf.baselineViewsPerDay.toLocaleString()}회
                    </p>
                    {perf.videos.length === 0 && <p className="text-[10px] text-slate-500">분석할 영상이 없습니다.</p>}
                    {perf.videos.map((v) => (
                      <div key={v.id} className="flex items-center justify-between gap-2 text-[11px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                        <span className="truncate font-medium text-slate-700">{v.title}</span>
                        <span className="shrink-0 text-slate-500">
                          {v.views.toLocaleString()}회 · {v.multiple}배
                          {v.isBreakout && (
                            <span className="ml-1.5 font-bold text-emerald-600">
                              {v.alreadyFollowedUp ? '급상승 (2탄 제작됨)' : v.id === perf.followUpCandidateId ? '급상승 → 다음 2탄 대상' : '급상승'}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: YouTube & Auto-Comment Integration Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Share2 className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-extrabold text-slate-900">4. 플랫폼 연동 및 자동 발행 설정</h2>
            </div>

            {!hasYoutubeConnected && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>유튜브 API 토큰 미등록</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  [발행 및 유튜브 연동] 메뉴에서 Google OAuth 토큰을 등록하면 쇼츠가 즉시 자동 업로드됩니다.
                </p>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {/* Auto Upload Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800">유튜브 쇼츠 자동 업로드</div>
                  <p className="text-[10px] text-slate-500">렌더링 완료 즉시 공개 상태로 게시</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoUploadYoutube}
                    onChange={(e) => handleToggleAutoUpload(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Auto Comment Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>첫 댓글 자동 등록</span>
                  </div>
                  <p className="text-[10px] text-slate-500">영상 게시 직후 내 채널 첫 댓글 작성</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoComment}
                    onChange={(e) => handleToggleAutoComment(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Comment Text */}
              {config.autoComment && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">고정/등록될 첫 댓글 문구</label>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">비워두면 AI 자동 작성</span>
                  </div>
                  <textarea
                    value={config.commentText || ''}
                    onChange={(e) => setConfig({ ...config, commentText: e.target.value })}
                    onBlur={() => handleSaveConfig()}
                    rows={2}
                    placeholder="비워두시면 AI가 영상 주제에 맞춘 시청자 참여 유도 첫 댓글을 알아서 작성합니다. (직접 지정하시려면 문구를 입력하세요)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-y"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 꿀팁: 구글 API로 댓글을 달기 위해서는 OAuth 토큰 발급 시 <span className="font-semibold text-slate-600">youtube.force-ssl</span> 권한이 포함되어 있어야 합니다.
                  </p>
                </div>
              )}

              {/* BGM Auto Ducking for AutoPilot */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-violet-600" />
                    <span>배경음악(BGM) & 오디오 덕킹</span>
                  </div>
                  <p className="text-[10px] text-slate-500">주제 맞춤형 BGM 자동 믹싱 및 대사 구간 볼륨 감쇠</p>
                </div>
                <select
                  value={config.bgmMood || 'auto'}
                  onChange={(e) => {
                    const updated = { ...config, bgmMood: e.target.value };
                    setConfig(updated);
                    handleSaveConfig(updated);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="auto">🤖 AI 자동 선곡 (권장)</option>
                  <option value="bgm_upbeat">☀️ 밝고 경쾌한 팝</option>
                  <option value="bgm_suspense">🌑 미스터리 & 스릴러</option>
                  <option value="bgm_lofi">☕ 감성 힐링 & 로파이</option>
                  <option value="bgm_epic">⚔️ 웅장한 시네마틱</option>
                  <option value="bgm_tech">⚡ 모던 테크 & 지식</option>
                  <option value="none">🔇 BGM 없음</option>
                </select>
              </div>

              {/* Telegram Mobile Notification Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>텔레그램 스마트폰 푸시 알림</span>
                  </div>
                  <p className="text-[10px] text-slate-500">발행 완료 시 스마트폰으로 영상 링크와 첫 댓글 즉시 전송</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableTelegramNotify ?? settings.enableTelegramNotify ?? true}
                    onChange={(e) => {
                      const updated = { ...config, enableTelegramNotify: e.target.checked };
                      setConfig(updated);
                      handleSaveConfig(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Modern Subtitle, Title Header & 3s Hook Intro Style with Real-Time Screen Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Heading className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  3. 상단 제목 & 후킹 타이틀 & 자막 스타일
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  실시간 화면 프리뷰 연동
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                상단 고정 제목, 첫 3초 후킹 인트로, 본문 자막 스타일이 오른쪽 9:16 모바일 화면에 실시간으로 즉시 적용됩니다.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            ⚡ 시청 지속 시간 극대화
          </span>
        </div>

        {/* 2-Column Responsive Layout: Left Controls + Right Live Phone Screen Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (lg:col-span-7 xl:col-span-7): Styling Controls */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* 3-A: Top Title Header Style */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>상단 고정 제목(Header) 스타일</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">영상 상단에 고정 노출되는 핵심 타이틀</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TITLE_STYLES.map((ts) => {
                  const isSelected = (config.titleStyleId || 'yellow_tape') === ts.id;
                  return (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, titleStyleId: ts.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-slate-900">{ts.name.split('(')[0].trim()}</span>
                        {ts.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {ts.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{ts.tag}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-B: First 3s Hook Intro Banner */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>초반 이탈 방지! 첫 3초 상단 후킹 타이틀 배너</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    영상 시작 0~2.3초간 강력한 팝업 모션으로 시청자의 시선을 끕니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableHookIntro ?? true}
                    onChange={(e) => {
                      const updated = { ...config, enableHookIntro: e.target.checked };
                      setConfig(updated);
                      handleSaveConfig(updated);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {(config.enableHookIntro ?? true) && (
                <div className="space-y-3 pt-2 border-t border-amber-200/60">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      후킹 타이틀 추천 프리셋 (원클릭 즉시 적용)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {HOOK_PRESETS.map((preset) => {
                        const isSelected = (config.hookIntroPreset || 'tips') === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              const updated: AutoPilotSchedule = {
                                ...config,
                                hookIntroPreset: preset.id,
                                hookTitleText: preset.id === 'custom' ? (config.hookTitleText || '') : preset.title,
                                hookSubtitleText: preset.id === 'custom' ? (config.hookSubtitleText || '') : preset.subtitle,
                              };
                              setConfig(updated);
                              handleSaveConfig(updated);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'border-amber-500 bg-amber-100/80 text-amber-950 shadow-xs font-black ring-2 ring-amber-300'
                                : 'border-amber-200/80 bg-white text-slate-700 hover:bg-amber-50/50 font-medium'
                            }`}
                          >
                            <span className="truncate block font-bold text-[11px]">{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customizable Hook Text Inputs with live reactive typing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                        <span>메인 후킹 문구 (상단 볼드)</span>
                        <span className="text-[9px] text-amber-600 font-semibold">실시간 화면 반영</span>
                      </label>
                      <input
                        type="text"
                        value={config.hookTitleText ?? '⚡ 놓치면 손해 3초 꿀팁 ⚡'}
                        onChange={(e) => {
                          setConfig({ ...config, hookTitleText: e.target.value });
                        }}
                        onBlur={() => handleSaveConfig()}
                        placeholder="예: ⚡ 놓치면 손해 3초 꿀팁 ⚡"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-xs font-black text-amber-950 focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                        <span>서브 후킹 문구 (하단 서브)</span>
                        <span className="text-[9px] text-amber-600 font-semibold">실시간 화면 반영</span>
                      </label>
                      <input
                        type="text"
                        value={config.hookSubtitleText ?? '끝까지 보면 인생이 바뀝니다'}
                        onChange={(e) => {
                          setConfig({ ...config, hookSubtitleText: e.target.value });
                        }}
                        onBlur={() => handleSaveConfig()}
                        placeholder="예: 끝까지 보면 인생이 바뀝니다"
                        className="w-full bg-white border border-amber-300/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3-C: Subtitle Style Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>본문 자막 비주얼 스타일</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">영상의 분위기에 맞춰 선택하세요</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SUBTITLE_STYLES.map((sub) => {
                  const isSelected = (config.subtitleStyleId || 'mrbeast') === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, subtitleStyleId: sub.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        {sub.name.split('&')[0].trim()}
                      </div>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">{sub.tag.split('/')[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-C-2: Subtitle Font Size Selection */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>본문 자막 글씨 크기</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">화면 가독성 맞춤 조절 (적정 크기 프리셋)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'small', label: '보통 (48pt)', desc: '단정한 기본 크기' },
                  { id: 'medium', label: '크게 (56pt)', desc: '추천 표준 크기', badge: '추천' },
                  { id: 'large', label: '아주 크게 (66pt)', desc: '눈에 띄는 강조형' },
                  { id: 'xlarge', label: '초대형 (78pt)', desc: '압도적 숏폼 시선집중' },
                ].map((sizeOpt) => {
                  const isSelected = (config.subtitleFontSize || 'medium') === sizeOpt.id;
                  return (
                    <button
                      key={sizeOpt.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, subtitleFontSize: sizeOpt.id as SubtitleFontSize };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`relative p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 shadow-sm ring-2 ring-indigo-200 text-indigo-950 font-black'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300 text-slate-700 font-semibold'
                      }`}
                    >
                      {sizeOpt.badge && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[9px] font-black bg-indigo-600 text-white rounded-full shadow-xs">
                          {sizeOpt.badge}
                        </span>
                      )}
                      <div className="text-xs">{sizeOpt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sizeOpt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3-D: Video Visual Screen Template Selection (13 Styles) */}
            <div className="space-y-2.5 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>영상 화면 비주얼 템플릿 (AI 이미지 화풍 13종)</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">채널 테마에 맞는 화풍을 선택하세요</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
                {TEMPLATES.map((tmpl) => {
                  const isSelected = (config.templateId || 'basic') === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, templateId: tmpl.id };
                        setConfig(updated);
                        handleSaveConfig(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/80 shadow-sm ring-2 ring-purple-200'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold text-slate-900 truncate">
                        {tmpl.name}
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 truncate max-w-full">
                        {tmpl.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-5 xl:col-span-5): Real-Time Phone Screen Preview */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5">
            <div className="w-full text-center mb-3">
              <span className="text-xs font-black text-slate-800 flex items-center justify-center gap-1.5">
                <span>📱 실제 숏폼 영상 실시간 프리뷰</span>
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                왼쪽에서 스타일이나 문구를 변경하면 즉시 화면에 반영됩니다
              </p>
            </div>

            <ShortsPhonePreview
              titleStyleId={config.titleStyleId || 'yellow_tape'}
              headerTitleText={config.channelNiche || '1분 만에 끝내는 실전 꿀팁'}
              enableHookIntro={config.enableHookIntro ?? true}
              hookTitleText={config.hookTitleText || '⚡ 놓치면 손해 3초 꿀팁 ⚡'}
              hookSubtitleText={config.hookSubtitleText || '끝까지 보면 인생이 바뀝니다'}
              subtitleStyleId={config.subtitleStyleId || 'mrbeast'}
              subtitleFontSize={config.subtitleFontSize || 'medium'}
              templateId={config.templateId || 'basic'}
              channelName={config.channelNiche?.slice(0, 8) || '쇼츠스튜디오'}
            />
          </div>
        </div>
      </div>

      {/* History Log Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-extrabold text-slate-900">AI 오토파일럿 자율 발행 이력</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchConfig(true)}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-purple-600 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
              <span>이력 새로고침</span>
            </button>
            <button
              onClick={onNavigateToProjects}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline"
            >
              전체 비디오 보관함 가기 ↗
            </button>
          </div>
        </div>

        {hasCommentScopeWarning && (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in duration-200">
            <div className="space-y-0.5">
              <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>영상은 정상 발행되었으나, 첫 댓글 작성 권한이 누락되었습니다.</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                구글 OAuth 토큰 발급 시 <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">youtube.force-ssl</code> 권한이 포함되어야 내 채널 첫 댓글 작성이 가능합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  handleToggleAutoComment(false);
                  handleCleanCommentWarnings();
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold transition-all shadow-xs"
              >
                첫 댓글 끄고 경고 정리
              </button>
              <button
                onClick={() => setIsCommentScopeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-sm transition-all active:scale-95"
              >
                권한 해결 가이드
              </button>
            </div>
          </div>
        )}

        {(!config.history || config.history.length === 0) ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-1">
            <p className="font-bold text-slate-600">아직 오토파일럿으로 발행된 이력이 없습니다.</p>
            <p>상단의 [지금 즉시 1편 시험 발행] 버튼을 누르거나 예약 시간을 기다리면 자동으로 기록됩니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {config.history.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.status === 'success' && (item.uploadStatus === 'uploaded' || item.videoUrl)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.status === 'success' && (item.uploadStatus === 'uploaded' || item.videoUrl)
                        ? '발행 성공'
                        : item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')
                        ? '⚠️ 영상완성 (유튜브 업로드 실패)'
                        : '제작 실패'}
                    </span>
                    {(item.uploadStatus === 'failed' || (!item.videoUrl && item.status === 'success')) && onNavigateToPublish && (
                      <button
                        onClick={onNavigateToPublish}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
                        title="클릭하여 유튜브 OAuth 토큰 상태 확인 및 재발급"
                      >
                        🔑 OAuth 토큰 확인 (플랫폼 연동 ↗)
                      </button>
                    )}
                    {item.commentStatus === 'posted' && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        💬 첫 댓글 완료
                      </span>
                    )}
                    {item.telegramNotified && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                        📲 텔레그램 전송됨
                      </span>
                    )}
                    {item.commentStatus === 'failed' && (
                      <button
                        onClick={() => setIsCommentScopeModalOpen(true)}
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors shadow-xs active:scale-95"
                        title="클릭하여 해결 가이드 확인"
                      >
                        ⚠️ 댓글 권한 확인 (해결 가이드)
                      </button>
                    )}
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">{item.topic}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                    {item.uploadError && <span className="text-amber-600 ml-2 font-medium">({item.uploadError})</span>}
                    {item.errorMessage && !item.uploadError && <span className="text-rose-500 ml-2">({item.errorMessage})</span>}
                    {item.commentError && (
                      <button
                        onClick={() => setIsCommentScopeModalOpen(true)}
                        className="text-amber-600 ml-2 underline hover:text-amber-800 font-medium"
                      >
                        (OAuth 'youtube.force-ssl' 권한 누락 - 클릭하여 해결 ↗)
                      </button>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>유튜브 쇼츠 ↗</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Scope Help & One-Click Fix Modal */}
      {isCommentScopeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-14 px-6 border-b border-slate-200 bg-amber-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-sm text-slate-900">유튜브 첫 댓글 권한(Scope) 해결 가이드</h3>
              </div>
              <button
                onClick={() => setIsCommentScopeModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-amber-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>비디오 영상 업로드는 100% 정상 완료되었습니다!</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  유튜브 쇼츠 영상 자체는 채널에 이미 정상적으로 게시되었으며, 게시 직후 내 채널 명의로 작성하려던 '첫 댓글(고정 댓글)'만 권한 부족으로 생략된 상태입니다.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">왜 댓글 권한 확인 알림이 뜨나요?</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  구글 보안 정책상 <b>비디오 업로드 권한(<code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">youtube.upload</code>)</b>과 <b>댓글 작성 권한(<code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">youtube.force-ssl</code>)</b>이 별도로 분리되어 있습니다. 현재 등록된 토큰에 댓글 작성 권한이 포함되지 않아 첫 댓글 작성이 차단된 상태입니다.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-extrabold text-slate-800 flex items-center justify-between">
                    <span>옵션 1: 첫 댓글 자동 작성을 원하지 않는 경우 (가장 간편)</span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">원클릭 해결</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    첫 댓글 기능을 끄고 이전 경고를 정리합니다. 이후 발행되는 모든 쇼츠는 실패 알림 없이 100% [발행 성공]만 깔끔하게 표시됩니다.
                  </p>
                  <button
                    onClick={() => {
                      handleToggleAutoComment(false);
                      handleCleanCommentWarnings();
                      setIsCommentScopeModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
                  >
                    첫 댓글 기능 끄고 이전 경고 깔끔하게 정리하기
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="font-extrabold text-blue-900">
                    옵션 2: 첫 댓글까지 완전 자동으로 게시하고 싶은 경우
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Google OAuth Playground에서 <code className="bg-white px-1 rounded text-red-600 font-mono text-[10px]">youtube.upload</code>와 <code className="bg-white px-1 rounded text-blue-600 font-mono text-[10px]">youtube.force-ssl</code> 2개를 함께 체크하여 Refresh Token을 1분 만에 재발급받으시면 됩니다.
                  </p>
                  {onNavigateToPublish && (
                    <button
                      onClick={() => {
                        setIsCommentScopeModalOpen(false);
                        onNavigateToPublish();
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95"
                    >
                      [발행 및 유튜브 연동] 메뉴에서 상세 가이드 보기 ↗
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
