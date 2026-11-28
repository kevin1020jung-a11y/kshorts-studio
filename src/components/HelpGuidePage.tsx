import React, { useState } from 'react';
import {
  Video,
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import type { NavTab } from './Sidebar';

interface HelpGuidePageProps {
  onNavigate: (tab: NavTab) => void;
}

export const HelpGuidePage: React.FC<HelpGuidePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'creation'>('youtube');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-600 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              K-Shorts 완벽 가이드북
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 border border-red-200">
                초보자 맞춤 안내
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              유튜브 자동 업로드 및 첫 댓글 자동 고정부터 쇼츠 영상 제작까지 상세히 안내합니다.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'youtube'
                ? 'bg-white text-red-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            유튜브 자동업로드 & 첫 댓글 세팅
          </button>
          <button
            onClick={() => setActiveTab('creation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'creation'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            쇼츠 제작 파이프라인
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: YOUTUBE AUTO-UPLOAD & FIRST COMMENT COMPLETE GUIDE */}
      {/* ======================================================== */}
      {activeTab === 'youtube' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-red-500/10 via-rose-500/5 to-amber-500/10 border border-red-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h2 className="text-base font-black text-slate-900">
                  처음 1번만 세팅하면 끝! 초등학생도 따라 하는 5단계 유튜브 연동
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  K-Shorts Studio는 여러분의 채널에 안전하게 영상을 올리고 첫 댓글을 고정하기 위해 구글 공식 승인 방식을 사용합니다.
                  아래 1단계부터 5단계까지 차근차근 순서대로 따라오시면 약 5분 만에 세팅이 완료됩니다!
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-red-200 text-[11px] font-bold text-red-700 shadow-2xs">
                    ① 구글 프로젝트 & API
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-red-200 text-[11px] font-bold text-red-700 shadow-2xs">
                    ② 앱 프로덕션 게시 (7일 만료 방지)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-red-200 text-[11px] font-bold text-red-700 shadow-2xs">
                    ③ 클라이언트 ID & 시크릿 발급
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-red-200 text-[11px] font-bold text-red-700 shadow-2xs">
                    ④ 리프래시 토큰 발급
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 self-center" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-700 shadow-2xs">
                    ⑤ K-Shorts 등록 & 댓글 설정
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Google Cloud에서 프로젝트 만들고 YouTube API 켜기
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    내 유튜브 채널과 대화할 구글 클라우드 작업 공간을 준비합니다.
                  </p>
                </div>
              </div>
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <span>Google Cloud 바로가기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 pl-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">1-1.</span>
                <span>
                  <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
                    Google Cloud Console
                  </a>
                  에 접속하여 <b>내 유튜브 채널이 있는 구글 계정</b>으로 로그인합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">1-2.</span>
                <span>
                  화면 맨 위 상단바에서 <b>[프로젝트 선택]</b> 드롭다운을 누른 뒤, 팝업 우측 상단의 <b>[새 프로젝트]</b>를 클릭합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">1-3.</span>
                <span>
                  프로젝트 이름에 알아보기 쉬운 이름(예: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold">My-KShorts</code>)을 적고 <b>[만들기]</b>를 클릭합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">1-4.</span>
                <span>
                  상단 검색창에 <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">YouTube Data API v3</code>를 검색하여 클릭한 후, 파란색 <b>[사용 설정 (Enable)]</b> 버튼을 클릭합니다.
                </span>
              </li>
            </ol>
          </div>

          {/* STEP 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    OAuth 동의 화면 구성 및 '프로덕션' 게시 (★ 필수: 7일 만료 방지)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    '프로덕션'으로 게시해야 로그인 토큰이 7일 뒤에 풀리지 않고 평생 안전하게 유지됩니다.
                  </p>
                </div>
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials/consent"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <span>동의 화면 직속 링크</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 pl-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">2-1.</span>
                <span>
                  좌측 메뉴에서 <b>[API 및 서비스]</b> ➔ <b>[OAuth 동의 화면]</b> (또는 <b>[Google 인증 플랫폼]</b>)으로 이동합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">2-2.</span>
                <span>
                  User Type 선택 화면이 나오면 <b>[외부 (External)]</b>를 선택하고 <b>[만들기]</b>를 클릭합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">2-3.</span>
                <span>
                  기본 정보 3가지만 입력합니다 (나머지는 건너뜁니다):<br />
                  • <b>앱 이름</b>: 아무거나 입력 (예: <span className="font-mono text-slate-900 bg-slate-100 px-1 rounded font-bold">K-Shorts Auto</span>)<br />
                  • <b>사용자 지원 이메일</b>: 본인 구글 이메일 선택<br />
                  • <b>개발자 연락처 정보</b>: 본인 구글 이메일 입력<br />
                  ➔ 맨 아래로 스크롤하여 <b>[저장 후 계속]</b>을 계속 눌러 설정을 끝마칩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">2-4.</span>
                <div className="space-y-2 flex-1">
                  <span className="font-bold text-red-600">
                    ★ 가장 중요한 핵심 (7일 만료 방지):
                  </span>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      게시 상태를 꼭 '프로덕션'으로 변경해 주세요!
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      좌측 메뉴의 <b>[대상 (Audience)]</b> 또는 <b>[OAuth 동의 화면]</b> 메인 화면을 보면 <b>게시 상태 (Publishing status)</b>가 <span className="bg-amber-200/80 px-1 py-0.5 rounded font-mono font-bold">테스트 (Testing)</span>로 되어 있습니다.<br />
                      바로 아래/옆의 <b>[앱 게시 (Publish App)]</b> 또는 <b>[프로덕션으로 푸시]</b> 버튼을 누르고 확인을 누르면 <b className="text-emerald-700">프로덕션(In production)</b>으로 바뀝니다.<br />
                      <span className="text-[10px] text-amber-700 font-medium">※ 본인 개인 유튜브 업로드용이므로 구글 공식 검수(승인 요청)를 제출하지 않아도 계속 영구 사용 가능합니다.</span>
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* STEP 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    클라이언트 ID & 클라이언트 시크릿 코드 발급받기
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    K-Shorts 앱이 구글에 본인임을 인증할 수 있는 열쇠(Key)를 생성합니다.
                  </p>
                </div>
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <span>사용자 인증 정보 바로가기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="space-y-2.5 text-xs text-slate-700 pl-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">3-1.</span>
                <span>
                  좌측 메뉴에서 <b>[사용자 인증 정보 (Credentials)]</b>를 클릭합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">3-2.</span>
                <span>
                  화면 상단의 <b>[+ 사용자 인증 정보 만들기]</b> 버튼을 누르고 ➔ <b>[OAuth 클라이언트 ID]</b>를 선택합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">3-3.</span>
                <span>
                  <b>애플리케이션 유형</b> 드롭다운에서 <b>[웹 애플리케이션 (Web application)]</b>을 선택합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">3-4.</span>
                <div className="space-y-1.5 flex-1">
                  <span>
                    아래로 내려가서 <b>[승인된 리디렉션 URI (Authorized redirect URIs)]</b> 항목 아래의 <b>[+ URI 추가]</b>를 클릭합니다.
                  </span>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 max-w-xl">
                    <code className="text-[11px] font-mono font-bold text-red-600 flex-1 break-all">
                      https://developers.google.com/oauthplayground
                    </code>
                    <button
                      onClick={() => handleCopy('https://developers.google.com/oauthplayground', 'redirect-uri')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 shrink-0 shadow-2xs"
                    >
                      {copiedKey === 'redirect-uri' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'redirect-uri' ? '복사됨' : '주소 복사'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    ※ 위 주소를 정확히 넣어주셔야 다음 단계에서 토큰을 정상 발급받을 수 있습니다.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">3-5.</span>
                <span>
                  맨 아래 <b>[만들기]</b> 버튼을 누르면 팝업창이 뜨며 <b>클라이언트 ID (Client ID)</b>와 <b>클라이언트 보안 비밀 (Client Secret)</b>이 나타납니다. 두 값을 메모장에 안전하게 복사해둡니다.
                </span>
              </li>
            </ol>
          </div>

          {/* STEP 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  4
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Google OAuth Playground에서 리프래시 토큰(Refresh Token) 1분 발급
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    내 유튜브 채널에 비디오를 올리고 댓글을 달 수 있는 최종 승인 토큰을 발급받습니다.
                  </p>
                </div>
              </div>
              <a
                href="https://developers.google.com/oauthplayground"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>OAuth Playground 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="space-y-3 text-xs text-slate-700 pl-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">4-1.</span>
                <div className="space-y-1.5 flex-1">
                  <span>
                    <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">
                      OAuth Playground
                    </a>
                    에 접속한 후, 우측 상단의 <b>⚙️ 톱니바퀴 아이콘 (OAuth 2.0 configuration)</b>을 클릭합니다.
                  </span>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1 text-slate-600">
                    <p>• <b>[Use your own OAuth credentials]</b> 체크박스를 체크합니다.</p>
                    <p>• <b>OAuth Client ID</b>: 3단계에서 복사한 Client ID 붙여넣기</p>
                    <p>• <b>OAuth Client secret</b>: 3단계에서 복사한 Client Secret 붙여넣기</p>
                    <p>• 톱니바퀴 아이콘을 다시 눌러 설정창을 닫습니다.</p>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">4-2.</span>
                <div className="space-y-1.5 flex-1">
                  <span>
                    화면 좌측 <b>Step 1 (Select & authorize APIs)</b>에서 <b>YouTube Data API v3</b>를 찾아 펼친 후 아래 <b>2개 항목</b>을 체크합니다:
                  </span>
                  <div className="space-y-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-red-600 font-bold">
                      <span>• https://www.googleapis.com/auth/youtube.upload (영상 업로드 권한)</span>
                    </div>
                    <div className="flex items-center justify-between text-blue-600 font-bold">
                      <span>• https://www.googleapis.com/auth/youtube.force-ssl (댓글 작성 및 고정 권한)</span>
                    </div>
                  </div>
                  <span>
                    그 다음 아래 파란색 <b>[Authorize APIs]</b> 버튼을 클릭합니다.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">4-3.</span>
                <div className="space-y-1 flex-1">
                  <span>
                    유튜브 채널이 연결된 구글 계정으로 로그인합니다.
                  </span>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-blue-900 text-[11px]">
                    <b>⚠️ "Google에서 확인하지 않은 앱입니다" 경고가 뜨는 경우 (정상 과정):</b><br />
                    화면 좌측 하단의 <b>[고급 (Advanced)]</b> 클릭 ➔ 맨 아래 <b>[... (으)로 이동(안전하지 않음)]</b> 클릭 ➔ 모든 권한 항목에 체크 후 <b>[계속]</b>을 누르시면 됩니다.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="font-black text-slate-400">4-4.</span>
                <div className="space-y-1.5 flex-1">
                  <span>
                    권한을 허용하면 자동으로 중앙 <b>Step 2 (Exchange authorization code for tokens)</b>로 넘어옵니다.
                  </span>
                  <p>
                    파란색 <b>[Exchange authorization code for tokens]</b> 버튼을 클릭합니다.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 text-[11px] space-y-1">
                    <p className="font-bold flex items-center gap-1 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      성공! 우측 창에서 Refresh token을 복사하세요.
                    </p>
                    <p>
                      오른쪽 결과 창에서 <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-slate-900 font-mono font-bold">Refresh token</code> 값(보통 <span className="font-mono text-emerald-700 font-bold">1//04...</span> 로 시작함)을 복사합니다.<br />
                      <span className="text-[10px] text-emerald-700">※ 주의: Access token이 아니라 반드시 Refresh token을 복사해야 합니다!</span>
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* STEP 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shadow-xs">
                  5
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    K-Shorts Studio에 등록하고 유튜브 자동 업로드 & 첫 댓글 세팅하기
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    이제 발급받은 정보 3가지를 넣고 자동 업로드와 첫 댓글을 켜기만 하면 완성입니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('publish')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>[플랫폼 연동 세팅]으로 바로 이동</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">입력 항목 1</span>
                  <p className="font-bold text-slate-900">YouTube OAuth Client ID</p>
                  <p className="text-[11px] text-slate-500">3단계에서 발급받은 클라이언트 ID 붙여넣기</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">입력 항목 2</span>
                  <p className="font-bold text-slate-900">YouTube Client Secret</p>
                  <p className="text-[11px] text-slate-500">3단계에서 발급받은 클라이언트 시크릿 붙여넣기</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500">입력 항목 3</span>
                  <p className="font-bold text-slate-900">YouTube Refresh Token</p>
                  <p className="text-[11px] text-slate-500">4단계에서 발급받은 Refresh Token 붙여넣기</p>
                </div>
              </div>

              {/* Setting Switches Guide */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  스위치 켜기 및 첫 댓글(고정댓글) 세팅 방법
                </h4>

                <div className="space-y-3 pl-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      A
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        [유튜브 채널 & 댓글 권한 테스트] 버튼 클릭
                      </p>
                      <p className="text-[11px] text-slate-600">
                        입력란 상단의 검은색 테스트 버튼을 누릅니다. <b>"유튜브 채널 연동에 성공했습니다."</b> 메시지가 뜨면 정상 연결된 것입니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      B
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        [쇼츠 비디오 렌더링 완료 즉시 자동 업로드] 토글 ON
                      </p>
                      <p className="text-[11px] text-slate-600">
                        이 스위치를 켜두시면 K-Shorts에서 영상을 만들자마자 수동 다운로드/업로드할 필요 없이 내 유튜브 채널로 즉시 자동 전송됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      C
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">
                        [첫 댓글 자동 작성 & 맨 위에 고정] 토글 ON 및 댓글 내용 작성
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        영상이 올라가자마자 1초 만에 내 채널의 첫 댓글을 달고 최상단에 고정(Pin)합니다.<br />
                        • <b>직접 작성 모드</b>: 제휴 링크(쿠팡 파트너스, 블로그, 뉴스레터 링크 등)나 고정 멘트를 직접 적어둘 수 있습니다.<br />
                        • <b>AI 스마트 댓글 모드</b>: AI가 생성된 영상의 주제와 대본 내용에 딱 맞는 공감/참여 유도 질문을 자동으로 만들어 첫 댓글로 남겨줍니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      D
                    </span>
                    <div>
                      <p className="font-bold text-emerald-700">
                        맨 아래 우측 [설정 저장] 버튼 누르기
                      </p>
                      <p className="text-[11px] text-slate-600">
                        반드시 <b>[설정 저장]</b>을 눌러주셔야 입력하신 정보가 안전하게 영구 보관됩니다!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Result Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">모든 세팅이 끝났습니다!</p>
                    <p className="text-[11px] text-emerald-700">
                      이제 '쇼츠 자동 제작'에서 영상을 만드시면 자동으로 유튜브 업로드와 첫 댓글까지 한 번에 완료됩니다.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('publish')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  지금 연동하러 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SHORTS CREATION PIPELINE GUIDE */}
      {/* ======================================================== */}
      {activeTab === 'creation' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-sm font-extrabold text-blue-600">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>쇼츠 주제 입력 및 AI 대본 생성</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 font-medium">
                '쇼츠 자동 제작' 탭에서 만들고 싶은 주제를 한 줄로 입력하고 [AI 대본 즉시 생성]을 누르면,
                첫 3초 후킹 질문부터 클라이맥스, 마무리 CTA까지 50초 내외의 완벽한 쇼츠 대본이 완성됩니다.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-sm font-extrabold text-purple-600">
                <span className="w-7 h-7 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>한국어 AI 목소리 & 템플릿 선택</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 font-medium">
                아나운서 톤의 '선희', 비즈니스/자기계발 '인준', 트렌디 유튜버 '현수' 등 6종의 Neural TTS 보이스와
                기본 모던, 3D 애니메이션 등 12가지 비주얼 스타일 중 마음에 드는 항목을 클릭합니다.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-sm font-extrabold text-emerald-600">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>원클릭 쇼츠 렌더링 & 유튜브 자동 발행</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 font-medium">
                [원클릭 쇼츠 비디오 렌더링 시작] 버튼을 누르면 1080x1920 세로 FHD 쇼츠가 자동 생성되며(장면 수와 이미지 엔진에 따라 수 분 소요),
                유튜브 연동이 켜져 있는 경우 바로 내 채널로 즉시 업로드 및 첫 댓글이 자동 고정됩니다.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>지금 바로 쇼츠 제작 시작하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
