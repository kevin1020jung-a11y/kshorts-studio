import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Smartphone,
  Flame,
  Check,
} from 'lucide-react';
import type { HookingVariant, ScriptScene } from '../types';

interface ThumbnailABEditorProps {
  topic: string;
  onApplyTitleAndHook: (newTitle: string, newHookIntro: string, heroVisualPrompt?: string) => void;
  currentHookIntroText?: string;
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
}

export const ThumbnailABEditor: React.FC<ThumbnailABEditorProps> = ({
  topic,
  onApplyTitleAndHook,
  currentHookIntroText,
  scenes,
  onChangeScenes,
}) => {
  const [variants, setVariants] = useState<HookingVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('variant_a');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHeroStyle, setSelectedHeroStyle] = useState<'dramatic' | 'mystery' | 'vibrant'>('dramatic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchVariants = async (targetTopic: string) => {
    setIsLoading(true);
    try {
      if (window.electronAPI?.generateHookingVariants) {
        const res = await window.electronAPI.generateHookingVariants({ topic: targetTopic });
        if (res && res.length > 0) {
          setVariants(res);
          setSelectedVariantId(res[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to generate hooking variants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topic && topic.trim()) {
      fetchVariants(topic);
    }
  }, [topic]);

  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handleApply = (variant: HookingVariant) => {
    setSelectedVariantId(variant.id);

    // Hero Visual Prompt calculation based on selectedHeroStyle
    let heroPrompt = variant.visualKeyword;
    if (selectedHeroStyle === 'mystery') {
      heroPrompt = `Cinematic moody mysterious close-up of ${topic}, volumetric light, dramatic fog, 8k`;
    } else if (selectedHeroStyle === 'vibrant') {
      heroPrompt = `Vibrant ultra-clean 3D modern isometric showcase of ${topic}, sharp lighting, octane render, trending on artstation`;
    }

    onApplyTitleAndHook(variant.title, variant.hookIntro, heroPrompt);

    // If scenes exist, update Scene 0 (Thumbnail / Hero)
    if (scenes.length > 0) {
      const nextScenes = [...scenes];
      if (nextScenes[0]) {
        nextScenes[0] = {
          ...nextScenes[0],
          visualPrompt: heroPrompt,
          text: variant.title,
        };
        onChangeScenes(nextScenes);
      }
    }

    showToast(`'${variant.type}' 후킹 카피와 썸네일 연출이 적용되었습니다!`);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>AI 썸네일 & 3초 후킹 A/B 테스트 생성기</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              시청자가 스크롤을 멈추게 만드는 첫 3초 인트로와 썸네일(Scene 0) 후킹 카피를 A/B 테스트하여 최적의 선택을 내립니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchVariants(topic)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          <span>후킹 카피 다시 뽑기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: 3 A/B Variants */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-xs font-extrabold text-slate-700 block">
            알고리즘 추천 후킹 카피 선택 (원클릭 적용):
          </span>

          <div className="space-y-2.5">
            {variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleApply(v)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50/50 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{v.type}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {v.badge}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      "{v.title}"
                    </h4>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">3초 인트로 배너:</span>
                      <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {v.hookIntro}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 pt-0.5">
                      💡 {v.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-medium">
                      클릭 시 제목과 첫 장면 비주얼 프롬프트가 동시 세팅됩니다
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(v);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ 적용됨' : '선택 적용'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Hero Tone Selection */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-extrabold text-slate-700 block">
              썸네일(Scene 0) 비주얼 화풍 연출 톤:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedHeroStyle('dramatic');
                  if (activeVariant) handleApply({ ...activeVariant });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedHeroStyle === 'dramatic'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-black">익스트림 임팩트</div>
                <div className="text-[10px] opacity-70 mt-0.5">극적인 클로즈업 & 조명</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedHeroStyle('mystery');
                  if (activeVariant) handleApply({ ...activeVariant });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedHeroStyle === 'mystery'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-black">시네마틱 미스터리</div>
                <div className="text-[10px] opacity-70 mt-0.5">호기심 자극 무드</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedHeroStyle('vibrant');
                  if (activeVariant) handleApply({ ...activeVariant });
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedHeroStyle === 'vibrant'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-black">네온 / 모던 3D</div>
                <div className="text-[10px] opacity-70 mt-0.5">시선 강탈 비비드 컬러</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: 9:16 Mobile Thumbnail Mockup Simulation */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>9:16 썸네일 실시간 시뮬레이션</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              0.5초 피드 뷰
            </span>
          </div>

          <div className="aspect-[9/16] w-full max-w-[240px] mx-auto rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-3 shadow-xl border-4 border-slate-800 flex flex-col justify-between relative overflow-hidden text-white">
            {/* Top Hook Badge */}
            <div className="space-y-1 relative z-10">
              <div className="inline-block bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm animate-pulse">
                {activeVariant?.hookIntro || '⚡ 3초 핵심 요약'}
              </div>
            </div>

            {/* Center Eye-catching Thumbnail Graphics */}
            <div className="my-auto text-center space-y-2 relative z-10 px-1">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-amber-300 animate-bounce" />
              </div>
              <h5 className="text-xs font-black leading-tight text-white drop-shadow-md line-clamp-3">
                {activeVariant?.title || topic}
              </h5>
            </div>

            {/* Bottom YouTube Shorts Overlay Info */}
            <div className="space-y-1 relative z-10 pt-2 border-t border-white/10 text-[9px] text-slate-300">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-bold">K-Shorts 자동 최적화</span>
              </div>
            </div>

            {/* Background Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
