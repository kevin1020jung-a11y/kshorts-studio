import React, { useState, useRef } from 'react';
import { Music, Volume2, Sparkles, Check, Play, Square, Flame, ShieldCheck } from 'lucide-react';
import { BGM_TRACKS } from '../constants/bgm';

interface BgmSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  bgmVolume: number;
  onChangeVolume: (volume: number) => void;
  enableBgm: boolean;
  onToggleBgm: (enabled: boolean) => void;
  enableHookIntro?: boolean;
  onToggleHookIntro?: (enabled: boolean) => void;
  enablePopupSubtitles?: boolean;
  onTogglePopupSubtitles?: (enabled: boolean) => void;
  enableSfx?: boolean;
  onToggleSfx?: (enabled: boolean) => void;
  sfxVolume?: number;
  onChangeSfxVolume?: (volume: number) => void;
  currentTopic?: string;
  syncHighlightSfx?: boolean;
  onToggleHighlightSfx?: (enabled: boolean) => void;
}

export const BgmSelector: React.FC<BgmSelectorProps> = ({
  selectedMood,
  onSelectMood,
  bgmVolume,
  onChangeVolume,
  enableBgm,
  onToggleBgm,
  enableHookIntro = true,
  onToggleHookIntro,
  enablePopupSubtitles = true,
  onTogglePopupSubtitles,
  enableSfx = true,
  onToggleSfx,
  sfxVolume = 0.35,
  onChangeSfxVolume,
  currentTopic = '',
  syncHighlightSfx = true,
  onToggleHighlightSfx,
}) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = (e: React.MouseEvent, trackId: string, filename: string) => {
    e.stopPropagation();
    if (trackId === 'auto' || trackId === 'none') return;

    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioPath = filename.startsWith('sfx_') ? `./sfx/${filename}` : `./bgm/${filename}`;
    const audio = new Audio(audioPath);
    const vol = filename.startsWith('sfx_') ? sfxVolume * 1.5 : bgmVolume * 2;
    audio.volume = Math.min(1, Math.max(0.05, vol));
    audio.onended = () => setPlayingTrackId(null);
    audio.onerror = () => setPlayingTrackId(null);
    audio.play().catch(() => setPlayingTrackId(null));
    audioRef.current = audio;
    setPlayingTrackId(trackId);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                배경음악(BGM) & 스마트 오디오 덕킹
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                오디오 덕킹 탑재
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                직접 합성한 로열티 프리 음원
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              성우 목소리가 나올 때는 BGM이 자동으로 줄어들고(Ducking), 공백에서는 자연스럽게 올라옵니다.
            </p>
          </div>
        </div>

        {/* BGM Toggle Switch */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-700">BGM 사용</span>
          <button
            type="button"
            onClick={() => onToggleBgm(!enableBgm)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              enableBgm ? 'bg-violet-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                enableBgm ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {enableBgm && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          {/* Copyright Safe Guarantee Banner */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-[11px] text-emerald-950 leading-relaxed">
              <span className="font-bold text-emerald-800">로열티 프리 배경음악:</span>
              {' '}제공되는 배경음악은 프로그램이 직접 합성한 로열티 프리 음원입니다. 저작권 판정은 각 플랫폼 기준을 따릅니다.
              스마트폰 모바일 앱에서 직접 최신 트렌드 음악을 삽입하고 싶으신 경우 <b>'배경음악 없음'</b>을 선택하시면 됩니다.
            </div>
          </div>

          {/* Volume Control Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Volume2 className="w-4 h-4 text-violet-600" />
              <span>BGM 볼륨: {Math.round(bgmVolume * 100)}%</span>
              <span className="text-[10px] text-slate-400 font-medium">(성우 목소리 대비 밸런스)</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-56">
              <span className="text-[10px] text-slate-400 font-bold">10%</span>
              <input
                type="range"
                min="0.10"
                max="0.45"
                step="0.02"
                value={bgmVolume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-bold">45%</span>
            </div>
          </div>

          {/* BGM Mood Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BGM_TRACKS.map((track) => {
              const isSelected = selectedMood === track.id || (track.id === 'auto' && !selectedMood);
              const isPlaying = playingTrackId === track.id;

              // Auto-detected BGM mood for the current topic
              const detectedMood = track.id === 'auto' && currentTopic ? (() => {
                const text = currentTopic.toLowerCase();
                if (text.match(/공포|스릴러|미스터리|소름|괴담|심해|미제|충격|귀신|사건|벌금|탈옥|블랙홀|골짜기|외로운|비밀|어두운|복선|황당|범죄/)) {
                  return { label: '🌑 미스터리 & 긴장감 (Suspense)', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
                }
                if (text.match(/역사|동기부여|성공|위인|전쟁|왕실|명언|부자|백만장자|억만장자|애플|스타벅스|마케팅|다이아몬드|로또|워런|일론|금수저/)) {
                  return { label: '⚔️ 웅장한 시네마틱 (Epic)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
                }
                if (text.match(/뇌과학|뇌|심리|흑역사|이불킥|거짓말|나르시시스트|소시오패스|가스라이팅|미러링|자존감|지식|테크|ai|과학|기술|스마트폰|컴퓨터/)) {
                  return { label: '⚡ 모던 테크 & 지식 (Tech)', color: 'bg-sky-100 text-sky-800 border-sky-200' };
                }
                if (text.match(/건강|힐링|수면|명상|마음|요가|스트레스|휴식|호흡법|위로|감성|눈물|사망/)) {
                  return { label: '☕ 감성 힐링 & 로파이 (Lofi)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
                }
                return { label: '☀️ 밝고 경쾌한 팝 (Upbeat)', color: 'bg-rose-100 text-rose-800 border-rose-200' };
              })() : null;

              return (
                <div
                  key={track.id}
                  onClick={() => onSelectMood(track.id)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/50 shadow-sm ring-1 ring-violet-600'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold text-xs text-slate-900 leading-snug">
                        {track.name}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {track.id !== 'auto' && track.id !== 'none' && (
                          <button
                            type="button"
                            onClick={(e) => handlePreview(e, track.id, track.filename)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                              isPlaying
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-700'
                            }`}
                            title={isPlaying ? '정지' : '미리듣기'}
                          >
                            {isPlaying ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                          </button>
                        )}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                    {detectedMood && (
                      <div className={`mt-1.5 px-2 py-0.5 rounded-md border text-[10px] font-extrabold inline-flex items-center gap-1 ${detectedMood.color}`}>
                        <span>자동 선곡 예정:</span>
                        <span>{detectedMood.label}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                      {track.description}
                    </p>
                  </div>
                  {track.copyrightStatus && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="truncate">{track.copyrightStatus}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Retention Boost Options (Hook Intro + Pop-up Subtitles + SFX) */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onToggleHookIntro && (
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">첫 3초 후킹 인트로 배너</span>
                <span className="text-[10px] text-slate-500">스크롤 이탈을 막는 강렬한 0~2초 오버레이</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableHookIntro}
              onChange={(e) => onToggleHookIntro(e.target.checked)}
              className="w-4 h-4 text-violet-600 rounded accent-violet-600 cursor-pointer"
            />
          </label>
        )}

        {onTogglePopupSubtitles && (
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">팝업 바운스 & 네온 자막</span>
                <span className="text-[10px] text-slate-500">MrBeast 스타일 단어 확대 & 키워드 강조</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enablePopupSubtitles}
              onChange={(e) => onTogglePopupSubtitles(e.target.checked)}
              className="w-4 h-4 text-violet-600 rounded accent-violet-600 cursor-pointer"
            />
          </label>
        )}
      </div>

      {/* Broadcast SFX (Sound Effects) Auto Design Engine */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🔊</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-extrabold text-slate-800">
                  바이럴 효과음(SFX) 자동 사운드 디자인
                </h4>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  알고리즘 시청지속율 +20%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                씬 전환(Whoosh), 인트로 후킹(Boom), 키워드 팝업(Pop), 핵심 꿀팁(Ding) 효과음 자동 믹싱
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {enableSfx && onChangeSfxVolume && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => onChangeSfxVolume(parseFloat(e.target.value))}
                  className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
            )}

            {onToggleSfx && (
              <button
                type="button"
                onClick={() => onToggleSfx(!enableSfx)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                  enableSfx ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    enableSfx ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* 5 Built-in SFX Chips with Preview */}
        {enableSfx && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {[
              { id: 'sfx_whoosh', name: '화면전환', icon: '💨', file: 'sfx_whoosh.mp3' },
              { id: 'sfx_boom', name: '후킹타격', icon: '💥', file: 'sfx_boom.mp3' },
              { id: 'sfx_pop', name: '자막팝업', icon: '🫧', file: 'sfx_pop.mp3' },
              { id: 'sfx_ding', name: '핵심꿀팁', icon: '🔔', file: 'sfx_ding.mp3' },
              { id: 'sfx_glitch', name: '경고반전', icon: '⚡', file: 'sfx_glitch.mp3' },
            ].map((sfx) => (
              <button
                key={sfx.id}
                type="button"
                onClick={(e) => handlePreview(e, sfx.id, sfx.file)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  playingTrackId === sfx.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>{sfx.icon}</span>
                  <span>{sfx.name}</span>
                </span>
                {playingTrackId === sfx.id ? (
                  <Square className="w-2.5 h-2.5 fill-current" />
                ) : (
                  <Play className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {enableSfx && onToggleHighlightSfx && (
          <div className="pt-2 border-t border-slate-100/80">
            <label className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200/60 bg-amber-50/40 hover:bg-amber-50/70 cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm">🔔</span>
                <div>
                  <span className="text-xs font-extrabold text-amber-950 block">
                    자막 핵심 단어 & 숫자 효과음 자동 싱크
                  </span>
                  <span className="text-[10px] text-amber-800/80">
                    돈/숫자/꿀팁 단어 발화 시 딩(Ding), 충격/반전 단어 발화 시 팝(Pop) 효과음 자동 동기화
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncHighlightSfx}
                onChange={(e) => onToggleHighlightSfx(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded accent-amber-600 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
