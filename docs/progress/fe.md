# FE 진행 (Next.js)

> 디렉토리: `frontend/`. Spring API 는 MSW 로 모킹.

## 초기 시드 (Milestone M2 까지)

- [ ] **FE-001** Tailwind v4 토큰 셋업 — `app/globals.css` 의 `@theme` 에 prototype CSS 변수 모두 매핑 + 시각 회귀 단위 테스트 — [docs/steps/fe/FE-001.md](../steps/fe/FE-001.md)
- [ ] **FE-002** 스플래시 페이지 (`app/page.tsx`) — NewPick 로고 + 인트로 + "서비스 시작하기" 버튼 + Vitest 렌더 테스트
- [ ] **FE-003** 카테고리 선택 페이지 + Zustand `useCategoryStore` + 토글 인터랙션 테스트
- [ ] **FE-004** PhoneFrame / BottomNav 공용 컴포넌트 + Testing Library 테스트
- [ ] **FE-005** `/(app)/feed` 페이지 — TanStack Query + MSW 로 빈 응답 처리 + 로딩 상태
- [ ] **FE-006** SSE 헬퍼 (`lib/sse.ts`) + MSW 의 SSE 모킹 셋업 + 단위 테스트
- [ ] **FE-007** 홈 로딩 화면의 진행률 카운터 컴포넌트 (mock SSE 이벤트로 동작 확인)
- [ ] **FE-008** NewsCard 컴포넌트 (홈 카드 1개 디자인 1대1 포팅) + 시각 단위 테스트

## Milestone M3 이후 (추가 예정)

- 기사 상세 페이지
- 인라인 OX 퀴즈
- 데일리 리포트 페이지
- 챗 페이지
- 빈/에러 상태

## 의존성

- 시작 전 BOOT-000 완료 필요.
- Spring API 와의 모든 통신은 [docs/contracts/openapi.yaml](../contracts/openapi.yaml) 동결 스펙 + MSW handlers 로 처리.
- 디자인 1대1 fidelity 는 [docs/design.md](../design.md) 가 기준.
