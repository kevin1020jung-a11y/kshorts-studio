import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Check,
  Video,
  Mic,
  Type,
  Palette,
  Music,
  Layout,
  BookmarkPlus,
} from 'lucide-react';
import { type ShortsPreset, DEFAULT_PRESETS } from '../types';
import { VOICES, VoiceSelector } from './VoiceSelector';
import { FONTS, FontSelector } from './FontSelector';
import { TEMPLATES, TemplateSelector } from './TemplateSelector';
import { SUBTITLE_STYLES, TITLE_STYLES } from './SubtitleStyleSelector';
import type { NavTab } from './Sidebar';

interface PresetsManagementPageProps {
  onApplyPresetAndNavigate: (preset: ShortsPreset) => void;
  onNavigate: (tab: NavTab) => void;
  currentVoiceId: string;
  onChangeVoiceId: (id: string) => void;
  currentTemplateId: string;
  onChangeTemplateId: (id: string) => void;
  currentImageEngine?: string;
}

const STORAGE_KEY = 'kshorts_custom_presets';

export const PresetsManagementPage: React.FC<PresetsManagementPageProps> = ({
  onApplyPresetAndNavigate,
  onNavigate,
  currentVoiceId,
  onChangeVoiceId,
  currentTemplateId,
  onChangeTemplateId,
  currentImageEngine,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'voices' | 'templates' | 'fonts'>('presets');
  const [customPresets, setCustomPresets] = useState<ShortsPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  const handleDeleteCustom = (id: string) => {
    if (!confirm('정말 이 프리셋을 삭제하시겠습니까?')) return;
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast('프리셋이 삭제되었습니다.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>K-Shorts 올인원 프리셋 & 에셋 허브</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            템플릿, 보이스 & 쇼츠 제작 프리셋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
            원클릭 추천 조합을 선택해 즉시 쇼츠 제작을 시작하거나, 검증된 한국어 보이스와 화풍 템플릿을 자유롭게 탐색해보세요.
          </p>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1.5 pt-6 relative z-10 border-t border-white/10 mt-6 flex-wrap">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>쇼츠 제작 프리셋 ({allPresets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'voices'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-blue-500" />
            <span>AI 성우 보이스 ({VOICES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-pink-500" />
            <span>비주얼 화풍 템플릿 ({TEMPLATES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fonts'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-amber-500" />
            <span>상업용 안심 폰트 ({FONTS.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Presets Gallery */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>원클릭 쇼츠 프리셋 목록</span>
              <span className="text-xs text-slate-400 font-normal">
                클릭 한 번으로 모든 제작 옵션이 세팅되며 쇼츠 제작 화면으로 바로 이동합니다.
              </span>
            </h2>
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              <span>제작 화면으로 이동</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPresets.map((preset) => {
              const voice = VOICES.find((v) => v.id === preset.voiceId);
              const font = FONTS.find(
                (f) =>
                  f.id === preset.fontId ||
                  f.id.replace(/\s+/g, '').toLowerCase() === (preset.fontId || '').replace(/\s+/g, '').toLowerCase()
              );
              const template = TEMPLATES.find((t) => t.id === preset.templateId);
              const subtitleStyle = SUBTITLE_STYLES.find((s) => s.id === preset.subtitleStyleId);
              const titleStyle = TITLE_STYLES.find((t) => t.id === preset.titleStyleId);

              return (
                <div
                  key={preset.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-2xs">
                          {preset.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {preset.name}
                            </h3>
                            {preset.isBuiltin ? (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                공식
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                커스텀
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      </div>

                      {!preset.isBuiltin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustom(preset.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Spec badges grid */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Mic className="w-3 h-3 text-blue-500" /> 성우 보이스
                        </span>
                        <span className="font-extrabold text-slate-800 text-[11px]">
                          {voice?.name || preset.voiceId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Type className="w-3 h-3 text-indigo-500" /> 자막 폰트
                        </span>
                        <span className="font-extrabold text-indigo-600 text-[11px]">
                          {font?.name ? font.name.split('(')[0].trim() : preset.fontId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Palette className="w-3 h-3 text-pink-500" /> 자막 스타일
                        </span>
                        <span className="font-extrabold text-pink-600 text-[11px]">
                          {subtitleStyle?.name ? subtitleStyle.name.split('&')[0].trim() : preset.subtitleStyleId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Layout className="w-3 h-3 text-amber-500" /> 비주얼 화풍
                        </span>
                        <span className="font-extrabold text-slate-800 text-[11px]">
                          {template?.name || preset.templateId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Music className="w-3 h-3 text-emerald-500" /> 배경음악(BGM)
                        </span>
                        <span className="font-extrabold text-emerald-700 text-[11px]">
                          {preset.enableBgm ? `${preset.bgmMood} (${Math.round(preset.bgmVolume * 100)}%)` : '없음'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    type="button"
                    onClick={() => onApplyPresetAndNavigate(preset)}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>이 프리셋으로 쇼츠 만들기</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Voices Library */}
      {activeTab === 'voices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900">
              한국어 특화 AI 성우 보이스 라인업
            </h2>
            <button
              onClick={() => onNavigate('ai-settings')}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              ElevenLabs API 설정 바로가기 →
            </button>
          </div>
          <VoiceSelector selectedVoiceId={currentVoiceId} onSelectVoice={onChangeVoiceId} />
        </div>
      )}

      {/* Tab 3: Templates Library */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-900">
            검증된 5대 비주얼 화풍 템플릿
          </h2>
          <TemplateSelector
            selectedTemplateId={currentTemplateId}
            onSelectTemplate={onChangeTemplateId}
            onOpenSettings={() => onNavigate('ai-settings')}
            currentEngine={currentImageEngine}
          />
        </div>
      )}

      {/* Tab 4: Commercial-Free Fonts Library */}
      {activeTab === 'fonts' && (
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-900">
            상업적 이용이 가능한 무료 폰트 (OFL 등)
          </h2>
          <FontSelector
            selectedFontId="Pretendard"
            onSelectFont={() => {}}
          />
        </div>
      )}
    </div>
  );
};
