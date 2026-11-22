// 개인용 빌드의 관리자(무제한) 로그인 코드를 설정한다.
// 사용법: node scripts/make-admin-code.js 내코드1234   (정확히 10자)
// admin.local.json 에 코드의 FNV-1a 해시만 저장한다. (코드 자체는 저장하지 않음, .gitignore 등록됨)
import fs from 'fs';
import path from 'path';

const code = String(process.argv[2] || '').trim();
if (code.length !== 10) {
  console.error('❌ 관리자 코드는 정확히 10자여야 합니다. 예: node scripts/make-admin-code.js MyCode2026');
  process.exit(1);
}
let h = 0x811c9dc5;
for (let i = 0; i < code.length; i++) {
  h ^= code.charCodeAt(i);
  h = Math.imul(h, 0x01000193);
}
const file = path.resolve('admin.local.json');
let current = {};
try { current = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
fs.writeFileSync(file, JSON.stringify({ ...current, adminKeyFnv: h >>> 0 }, null, 2), 'utf8');
console.log('✅ admin.local.json 저장 완료. 이제 npm run build 후 npm start 로 실행하고, 로그인 화면에 방금 입력한 10자 코드를 넣으세요.');
