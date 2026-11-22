import React, { useState } from 'react';
import { Bot, Key, Sparkles, Save, Check, Folder, ExternalLink, Image as ImageIcon, Video, Layers, ChevronRight, Info, Share2, Mic, Activity, Cpu, Zap, RefreshCw } from 'lucide-react';
import type { AppSettings } from '../types';
import { PORTAL_KO } from '../constants/portal';

interface AISettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onSelectOutputDirectory: () => Promise<string | null>;
  onNavigateToPublish?: () => void;
}

export const AISettingsPage: React.FC<AISettingsPageProps> = ({
  settings,
  onSaveSettings,
  onSelectOutputDirectory,
  onNavigateToPublish,
}) => {
  const [anthropicApiKey, setAnthropicApiKey] = useState(settings.anthropicApiKey || '');
  const [claudeModel, setClaudeModel] = useState(settings.claudeModel || 'claude-opus-5-5');
  const [isTestingClaude, setIsTestingClaude] = useState(false);
  const [claudeTestResult, setClaudeTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [falApiKey, setFalApiKey] = useState(settings.falApiKey || '');
  const [stabilityApiKey, setStabilityApiKey] = useState(settings.stabilityApiKey || '');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState(settings.elevenlabsApiKey || '');
  const [pexelsApiKey, setPexelsApiKey] = useState(settings.pexelsApiKey || '');
  const [pixabayApiKey, setPixabayApiKey] = useState(settings.pixabayApiKey || '');
  const [imageEngine, setImageEngine] = useState<'pollinations' | 'openai' | 'fal' | 'stability' | 'pexels' | 'pixabay' | 'gemini'>(
    settings.imageEngine || 'pollinations'
  );
  const [gpuEncoder, setGpuEncoder] = useState<'auto' | 'nvenc' | 'qsv' | 'cpu'>(
    settings.gpuEncoder || 'auto'
  );
  const [outputDir, setOutputDir] = useState(settings.outputDirectory || '');
  const [githubRepo, setGithubRepo] = useState(settings.githubRepo || '');
  const [saved, setSaved] = useState(false);

  // Test states
  const [isTestingEleven, setIsTestingEleven] = useState(false);
  const [elevenTestResult, setElevenTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isTestingPexels, setIsTestingPexels] = useState(false);
  const [pexelsTestResult, setPexelsTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isTestingPixabay, setIsTestingPixabay] = useState(false);
  const [pixabayTestResult, setPixabayTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isCheckingGpu, setIsCheckingGpu] = useState(false);
  const [gpuInfo, setGpuInfo] = useState<import('../types').GpuAccelerationInfo | null>(null);

  const [isTestingImage, setIsTestingImage] = useState(false);
  const [imageTestResult, setImageTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      anthropicApiKey: anthropicApiKey.trim() || undefined,
      claudeModel,
      geminiApiKey: geminiApiKey.trim() || undefined,
      openaiApiKey: openaiApiKey.trim() || undefined,
      falApiKey: falApiKey.trim() || undefined,
      stabilityApiKey: stabilityApiKey.trim() || undefined,
      elevenlabsApiKey: elevenlabsApiKey.trim() || undefined,
      pexelsApiKey: pexelsApiKey.trim() || undefined,
      pixabayApiKey: pixabayApiKey.trim() || undefined,
      imageEngine,
      gpuEncoder,
      outputDirectory: outputDir.trim() || undefined,
      githubRepo: githubRepo.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestPexels = async () => {
    if (!pexelsApiKey.trim()) {
      setPexelsTestResult({ success: false, error: 'Pexels API 키를 입력해주세요.' });
      return;
    }
    setIsTestingPexels(true);
    setPexelsTestResult(null);
    try {
      const res = await window.electronAPI.testPexelsConnection({ apiKey: pexelsApiKey.trim() });
      setPexelsTestResult(res);
    } catch (err: any) {
      setPexelsTestResult({ success: false, error: err?.message || 'Pexels 연결 실패' });
    } finally {
      setIsTestingPexels(false);
    }
  };

  const handleTestClaude = async () => {
    if (!anthropicApiKey.trim()) {
      setClaudeTestResult({ success: false, error: 'Claude API 키를 입력해주세요.' });
      return;
    }
    setIsTestingClaude(true);
    setClaudeTestResult(null);
    try {
      const res = await window.electronAPI.testClaudeConnection({ apiKey: anthropicApiKey.trim(), model: claudeModel });
      setClaudeTestResult(res);
    } catch (err: any) {
      setClaudeTestResult({ success: false, error: err?.message || 'Claude 연결 실패' });
    } finally {
      setIsTestingClaude(false);
    }
  };

  const handleTestPixabay = async () => {
    if (!pixabayApiKey.trim()) {
      setPixabayTestResult({ success: false, error: 'Pixabay API 키를 입력해주세요.' });
      return;
    }
    setIsTestingPixabay(true);
    setPixabayTestResult(null);
    try {
      const res = await window.electronAPI.testPixabayConnection({ apiKey: pixabayApiKey.trim() });
      setPixabayTestResult(res);
    } catch (err: any) {
      setPixabayTestResult({ success: false, error: err?.message || 'Pixabay 연결 실패' });
    } finally {
      setIsTestingPixabay(false);
    }
  };

  const handleCheckGpu = async () => {
    setIsCheckingGpu(true);
    try {
      const res = await window.electronAPI.checkGpuAcceleration();
      setGpuInfo(res);
    } catch (err: any) {
      setGpuInfo({
        success: false,
        encoder: 'libx264',
        extraArgs: '',
        typeName: 'CPU',
        badge: 'CPU',
        isHardware: false,
        error: err?.message || 'GPU 진단 실패',
      });
    } finally {
      setIsCheckingGpu(false);
    }
  };

  const handleTestElevenLabs = async () => {
    if (!elevenlabsApiKey.trim()) return;
    setIsTestingEleven(true);
    setElevenTestResult(null);
    try {
      const res = await window.electronAPI.testElevenLabsConnection({
        apiKey: elevenlabsApiKey.trim(),
      });
      setElevenTestResult(res);
    } catch (err: any) {
      setElevenTestResult({ success: false, error: err?.message || '연결 실패' });
    } finally {
      setIsTestingEleven(false);
    }
  };

  const handleTestImageEngine = async () => {
    if (!navigator.onLine) {
      setImageTestResult({
        success: false,
        error: '⚠️ 인터넷 연결이 끊겨 있습니다. Wi-Fi 또는 네트워크 상태를 확인해주세요.',
      });
      return;
    }
    setIsTestingImage(true);
    setImageTestResult(null);
    try {
      let keyToPass = '';
      if (imageEngine === 'gemini') keyToPass = geminiApiKey.trim();
      if (imageEngine === 'openai') keyToPass = openaiApiKey.trim();
      if (imageEngine === 'fal') keyToPass = falApiKey.trim();
      if (imageEngine === 'stability') keyToPass = stabilityApiKey.trim();
      if (imageEngine === 'pexels') keyToPass = pexelsApiKey.trim();
      if (imageEngine === 'pixabay') keyToPass = pixabayApiKey.trim();

      const res = await window.electronAPI.testImageEngine({
        engine: imageEngine,
        apiKey: keyToPass || undefined,
        prompt: '아름다운 서울 시네마틱 풍경',
      });
      setImageTestResult(res);
    } catch (err: any) {
      setImageTestResult({ success: false, error: err?.message || '테스트 실패' });
    } finally {
      setIsTestingImage(false);
    }
  };

  const handleChooseFolder = async () => {
    const chosen = await onSelectOutputDirectory();
    if (chosen) setOutputDir(chosen);
  };

  const registeredKeyCount = [
    anthropicApiKey,
    geminiApiKey,
    openaiApiKey,
    falApiKey,
    stabilityApiKey,
    elevenlabsApiKey,
    pexelsApiKey,
    pixabayApiKey,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>AI 설정 및 API 연동</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              API 키, 글 작성 및 이미지 생성 기본 모델을 선택합니다. API 키는 이 PC에만 암호화되어 안전하게 보관됩니다.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all self-start md:self-auto active:scale-95 shrink-0"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? '설정이 저장되었습니다' : '설정 저장'}</span>
        </button>
      </div>

      {/* Quick Navigation to SNS / Platform Settings */}
      {onNavigateToPublish && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">
                유튜브 댓글 자동화 및 4대 SNS(유튜브·인스타·틱톡·클립) 연동 세팅
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                쇼츠 업로드 즉시 첫 댓글 등록 및 인스타그램 릴스, 틱톡, {PORTAL_KO} 클립 연동은 전용 메뉴에서 손쉽게 세팅할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToPublish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95 shrink-0 shadow-xs"
          >
            <span>플랫폼 연동 세팅 바로가기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Registered API Key Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">등록된 API 키 관리</h2>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {registeredKeyCount > 0 ? `${registeredKeyCount}개 키 연동됨` : '등록 대기중'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-1">
          <div className="font-bold text-blue-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            <span>처음 사용하시나요?</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            무료로 사용할 수 있는 Google Gemini API 키 및 Pexels/Pixabay 무료 미디어 키를 아래에 입력하면 쇼츠 퀄리티가 대폭 상승합니다. 키가 없어도 기본 내장 모드로 즉시 생성이 가능합니다.
          </p>
        </div>

        {/* API Key Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Anthropic Claude API Key */}
          <div className="md:col-span-2 space-y-1.5 p-4 rounded-xl bg-orange-50/60 border border-orange-200 focus-within:border-orange-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Anthropic Claude API 키 (대본·제목·번역 1순위)</span>
              </label>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-orange-600 hover:text-orange-700 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>키 발급</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="password"
                value={anthropicApiKey}
                onChange={(e) => setAnthropicApiKey(e.target.value)}
                placeholder="sk-ant-... (Claude Console API 키)"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
              />
              <select
                value={claudeModel}
                onChange={(e) => setClaudeModel(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-bold"
              >
                <option value="claude-opus-5-5">Claude Opus 5.5 (최고 품질)</option>
                <option value="claude-sonnet-5-5">Claude Sonnet 5.5 (균형, 약 절반 비용)</option>
                <option value="claude-haiku-5-5">Claude Haiku 5.5 (최저 비용)</option>
              </select>
              <button
                type="button"
                onClick={handleTestClaude}
                disabled={isTestingClaude}
                className="px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold whitespace-nowrap"
              >
                {isTestingClaude ? '확인 중...' : '연결 테스트'}
              </button>
            </div>
            {claudeTestResult && (
              <p className={`text-[11px] font-bold ${claudeTestResult.success ? 'text-emerald-600' : 'text-red-500'}`}>
                {claudeTestResult.success ? claudeTestResult.message : `오류: ${claudeTestResult.error}`}
              </p>
            )}
            <p className="text-[10px] text-slate-500 font-medium">키를 넣으면 대본, 장면 묘사, 유튜브 제목·설명, 첫 댓글, 번역, 자동 주제 기획을 Claude가 먼저 맡고, 실패하면 Gemini ➡️ OpenAI ➡️ 내장 규칙 순으로 넘어갑니다. 키는 Windows 보안 저장소에 암호화되어 저장됩니다. Claude.ai 구독과는 별개로 사용량만큼 과금됩니다.</p>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Gemini API 키 (대본 2순위)</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>무료 발급</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy... (Google AI Studio Gemini 키)"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <p className="text-[10px] text-slate-500 font-medium">최신 Gemini 3.5 모델을 기본 사용하며, 무료 한도 소진 시 자동으로 3.1 ➡️ 2.5 Flash 순서로 전환됩니다.</p>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-emerald-600" />
                <span>OpenAI API 키 (선택)</span>
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>발급받기</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              placeholder="sk-... (OpenAI GPT-4o / DALL-E 3)"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
            />
            <p className="text-[10px] text-slate-500 font-medium">ChatGPT 기반 대본 및 DALL-E 3 이미지 엔진에 사용됩니다.</p>
          </div>

          {/* ElevenLabs API Key */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-purple-600" />
                <span>ElevenLabs API 키 (감정형 프리미엄 보이스)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestElevenLabs}
                  disabled={!elevenlabsApiKey.trim() || isTestingEleven}
                  className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-800 text-[10px] font-bold transition-all disabled:opacity-50"
                >
                  {isTestingEleven ? '확인 중...' : '연결 테스트'}
                </button>
                <a
                  href="https://elevenlabs.io/app/settings/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-600 hover:text-purple-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>발급받기</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <input
              type="password"
              value={elevenlabsApiKey}
              onChange={(e) => setElevenlabsApiKey(e.target.value)}
              placeholder="sk_... (ElevenLabs API Key)"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
            />
            {elevenTestResult && (
              <p className={`text-[11px] font-bold ${elevenTestResult.success ? 'text-emerald-600' : 'text-red-500'}`}>
                {elevenTestResult.success ? elevenTestResult.message : `오류: ${elevenTestResult.error}`}
              </p>
            )}
            <p className="text-[10px] text-slate-500 font-medium">인간과 구별할 수 없는 최고 수준의 감정 표현 및 억양 AI 목소리를 지원합니다.</p>
          </div>

          {/* Pexels API Key */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-purple-600" />
                <span>Pexels API 키 (무료 고화질 스톡 미디어)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestPexels}
                  disabled={isTestingPexels || !pexelsApiKey.trim()}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline disabled:opacity-40 disabled:no-underline flex items-center gap-1"
                >
                  <Activity className="w-3 h-3" />
                  <span>{isTestingPexels ? '확인 중...' : '연결 테스트'}</span>
                </button>
                <a
                  href="https://www.pexels.com/api/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-purple-600 hover:text-purple-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>무료 발급</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <input
              type="password"
              value={pexelsApiKey}
              onChange={(e) => setPexelsApiKey(e.target.value)}
              placeholder="Pexels 무료 API 키..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium"
            />
            {pexelsTestResult && (
              <p className={`text-[11px] font-bold ${pexelsTestResult.success ? 'text-emerald-600' : 'text-red-500'}`}>
                {pexelsTestResult.success ? pexelsTestResult.message : `오류: ${pexelsTestResult.error}`}
              </p>
            )}
            <p className="text-[10px] text-slate-500 font-medium">주제에 맞는 실제 세로 고화질 스톡 영상 및 사진을 자동 매칭합니다.</p>
          </div>

          {/* Pixabay API Key */}
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white transition-all">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Pixabay API 키 (무료 이미지/영상)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestPixabay}
                  disabled={isTestingPixabay || !pixabayApiKey.trim()}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline disabled:opacity-40 disabled:no-underline flex items-center gap-1"
                >
                  <Activity className="w-3 h-3" />
                  <span>{isTestingPixabay ? '확인 중...' : '연결 테스트'}</span>
                </button>
                <a
                  href="https://pixabay.com/api/docs/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-600 hover:text-amber-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>무료 발급</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
            <input
              type="password"
              value={pixabayApiKey}
              onChange={(e) => setPixabayApiKey(e.target.value)}
              placeholder="Pixabay 무료 API 키..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium"
            />
            {pixabayTestResult && (
              <p className={`text-[11px] font-bold ${pixabayTestResult.success ? 'text-emerald-600' : 'text-red-500'}`}>
                {pixabayTestResult.success ? pixabayTestResult.message : `오류: ${pixabayTestResult.error}`}
              </p>
            )}
            <p className="text-[10px] text-slate-500 font-medium">다양한 배경 비디오 및 일러스트 리소스를 무료로 가져옵니다.</p>
          </div>
        </div>
      </div>

      {/* 2. Default Visual & Image Engine Selection */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-extrabold text-slate-900">기본 비주얼 생성 엔진 선택</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">영상 배경 씬에 사용할 미디어 공급원</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'gemini', name: 'Google Gemini (Imagen 3)', desc: 'Gemini API 키를 이용한 포토리얼리스틱 고화질 AI 이미지' },
            { id: 'pexels', name: 'Pexels 실사 미디어 (비디오 & 사진)', desc: '9:16 실사 세로 비디오 우선 매칭 (비디오 없을 시 고화질 스톡 사진 자동 폴백)' },
            { id: 'pixabay', name: 'Pixabay 무료 미디어', desc: '풍부한 무료 스톡 비디오 & 사진 미디어' },
            { id: 'pollinations', name: 'Pollinations AI (무료)', desc: 'FLUX 기반 고화질 AI 생성 (키 불필요)' },
            { id: 'openai', name: 'OpenAI DALL-E 3', desc: 'OpenAI API 키를 이용한 프리미엄 AI 이미지' },
            { id: 'fal', name: 'Fal.ai (Flux Pro)', desc: 'Fal API 키 필요 / 초고속 실시간 생성' },
            { id: 'stability', name: 'Stability AI (SD3)', desc: 'Stability API 키 필요 / 정밀 이미지' },
          ].map((eng) => {
            const isSelected = imageEngine === eng.id;
            return (
              <div
                key={eng.id}
                onClick={() => setImageEngine(eng.id as any)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-100 shadow-sm'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{eng.name}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border text-[11px] font-bold ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">{eng.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Image Engine Test Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-600 font-medium">
            현재 선택된 엔진: <span className="font-extrabold text-blue-600">[{imageEngine.toUpperCase()}]</span>
          </div>
          <button
            type="button"
            onClick={handleTestImageEngine}
            disabled={isTestingImage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTestingImage ? '엔진 테스트 중 (10~15초)...' : '선택한 이미지 엔진 생성 테스트'}</span>
          </button>
        </div>
        {imageTestResult && (
          <p className={`text-xs font-bold px-3 py-1.5 rounded-lg ${imageTestResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {imageTestResult.success ? imageTestResult.message : `오류: ${imageTestResult.error}`}
          </p>
        )}
      </div>

      {/* 3. GPU Hardware Acceleration & Video Encoding */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">GPU 하드웨어 가속 및 렌더링 인코더</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                NVIDIA (NVENC) / Intel (QSV) 외장/내장 그래픽을 활용하여 렌더링 속도를 3~4배 가속합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckGpu}
            disabled={isCheckingGpu}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-50 shadow-xs self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isCheckingGpu ? '하드웨어 진단 중...' : '하드웨어 가속 진단'}</span>
          </button>
        </div>

        {gpuInfo && (
          <div className={`p-3 rounded-xl border text-xs font-medium ${gpuInfo.isHardware ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${gpuInfo.isHardware ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {gpuInfo.badge}
              </span>
              <span className="font-bold">{gpuInfo.typeName}</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold">{gpuInfo.message || gpuInfo.error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {[
            { id: 'auto', label: '자동 감지 (권장)', sub: '최적 인코더 자동 선택' },
            { id: 'nvenc', label: 'NVIDIA GPU', sub: 'h264_nvenc 초고속' },
            { id: 'qsv', label: 'Intel QuickSync', sub: 'h264_qsv 하드웨어' },
            { id: 'cpu', label: 'CPU 전용', sub: 'libx264 고호환' },
          ].map((item) => {
            const isSelected = gpuEncoder === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setGpuEncoder(item.id as any)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900 ring-2 ring-emerald-100 shadow-sm'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{item.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Output Directory Folder */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-extrabold text-slate-900">쇼츠 렌더링 결과물 저장 경로</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={outputDir}
            readOnly
            placeholder="기본 앱 데이터 폴더 (storage/output)"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-mono truncate focus:outline-none font-medium"
          />
          <button
            onClick={handleChooseFolder}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs shrink-0 transition-all shadow-sm"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>폴더 변경</span>
          </button>
        </div>
      </div>

      {/* 5. Auto-Update & GitHub Distribution */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-extrabold text-slate-900">프로그램 자동 업데이트 & GitHub 연동</h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            정식 출시 버전 v1.4.7
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          GitHub 저장소(<code>소유자/저장소명</code>)를 등록하면, 새 버전(릴리즈)이 배포되었을 때 프로그램이 자동으로 업데이트를 감지하여 원클릭으로 최신 설치 파일을 적용합니다.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            placeholder="예: username/kshorts-desktop"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>
    </div>
  );
};
