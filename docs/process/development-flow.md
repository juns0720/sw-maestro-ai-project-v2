# 개발 방법론 (Phase C)

3명이 병렬 작업해도 **merge 충돌 0** 으로 합쳐지도록 설계된 개발 흐름. 모든 step 은 한 트랙(`frontend/` / `backend/` / `ai/`) 안의 파일만 건드리며, 공유 파일(`docs/contracts/`, `docker-compose.yml`, `.env.example`, `docs/steps/`)은 BOOT-000 에서 한 번만 작성한 뒤 **읽기 전용**으로 다룬다.

## 트랙 정의

| 트랙 | 디렉토리 | 책임 |
|---|---|---|
| **FE** | `frontend/` | Next.js 15 + TypeScript + Tailwind v4 + Zustand + TanStack Query |
| **BE** | `backend/` | Spring Boot 3.4 + Java 17 + Gradle + Flyway + JPA + SseEmitter |
| **AI** | `ai/` | Python 3.12 + FastAPI + LangGraph + langchain-upstage |

각 트랙은 다른 트랙 없이 **모킹**으로 개발·테스트한다.

- FE: MSW (Mock Service Worker) 로 Spring API 응답 모킹
- BE: WireMock 또는 `@MockBean` 으로 Python AI 서비스 응답 모킹
- AI: 자체 FastAPI + Solar API 호출 (실제). DB 는 docker compose 의 PostgreSQL 사용

## 계약(Contract) 우선

`docs/contracts/` 가 단일 진실원천. BOOT-000 단계에서 작성·동결된다. 트랙들은 이 폴더를 **읽기만** 하며, 변경이 필요하면 별도 contract-update step 으로 처리.

| 파일 | 내용 |
|---|---|
| `docs/contracts/openapi.yaml` | Spring REST API 스펙 (FE-BE 계약) |
| `docs/contracts/python-ai.yaml` | Python FastAPI 스펙 (BE-AI 계약) |
| `docs/contracts/sse-events.md` | SSE 이벤트 스키마 (`step`/`done`/`warn`/`error`/`token`) |
| `docs/contracts/db-init.sql` | 초기 Flyway V1 마이그레이션 (DDL 동결) |
| `docs/contracts/json-schemas/*.json` | Article / Quiz / DailyReport JSON Schema |

## Step 정의

### ID 포맷

`{TRACK}-{NNN}` — 예: `BE-007`, `FE-012`, `AI-003`. BOOT-000 만 예외(공용).

### 크기

매우 작게: **1 step = 1 테스트 케이스 + 그 구현**. 30분~1시간 단위. 3 step 짜리 페이지보다 30 step 짜리 페이지가 정상.

### Step 명세 파일

`docs/steps/{track}/{ID}.md` — 1 step = 1 파일. 템플릿 6 섹션:

```markdown
# {ID} — {제목}

## 목표
이 step 이 무엇을 달성하는지 한 문단.

## 사전 조건
선행 step 목록 (예: `BE-003 완료`). 트랙 외부 의존은 모킹 가능 여부.

## 파일 대상
이 step 이 만들거나 수정하는 파일 경로. 다른 트랙 파일은 등장 X.

## 테스트 명세
- given/when/then
- 테스트 파일 경로 + 테스트 메서드명
- 통과 기준 (assertion)

## 구현 힌트
구현 시 참고할 기존 docs / 라이브러리 / 패턴. 코드 스니펫 가능.

## 검증 방법
사용자가 OK 판단을 위해 실행할 명령:
- 자동 테스트: `./gradlew :test --tests ...` 등
- 수동: `curl localhost:8080/api/...` 또는 "브라우저에서 X 확인"
```

## TDD 사이클 (1 step = 1 사이클)

엄격한 Red-Green-Refactor:

1. **Red** — `docs/steps/{track}/{ID}.md` 의 "테스트 명세"대로 실패하는 테스트 작성. 실행해서 실패 확인.
2. **Green** — 최소 구현으로 테스트 통과. 다른 테스트도 깨지지 않는지 확인.
3. **Refactor** — 가독성·중복 제거. 테스트는 계속 통과.
4. **검증** — 사용자가 step.md 의 "검증 방법" 명령을 실행해 결과 확인.
5. **Done** — 사용자 OK → 자동 commit + push + PR 생성 + progress 체크박스 갱신.

## 테스트 도구

| 트랙 | 도구 |
|---|---|
| FE | Vitest + Testing Library + MSW (단위·통합) |
| BE | JUnit 5 + Spring Boot Test + Testcontainers(PG) + WireMock |
| AI | pytest + httpx 비동기 테스트 클라이언트 + Solar API 모킹 |

E2E (Playwright) 는 MVP 범위 밖.

## 브랜치 / 커밋 / PR 전략

각 step 은 자체 feature 브랜치를 갖는다.

```
main
├── feat/boot-000-bootstrap
├── feat/be-001-flyway-init
├── feat/be-002-article-entity
├── feat/fe-001-splash-page
├── feat/ai-001-fastapi-skeleton
└── ...
```

브랜치 명: `feat/{track}-{NNN}-{slug}` (소문자 케밥 케이스).

step 완료 시 에이전트가 자동으로:
1. `git checkout -b feat/{track}-{NNN}-{slug}` (시작 시)
2. 작업 완료 후 `git add . && git commit -m "feat({track}): {NNN} {description}"`
3. `git push -u origin feat/{track}-{NNN}-{slug}`
4. `gh pr create --title "{NNN} {제목}" --body "..."` (PR 자동 생성)

merge 는 사용자가 GitHub UI 에서 수동. main 으로 들어간 뒤 다음 step 시작.

### 충돌 방지 보장

- step 은 트랙 디렉토리(`frontend/` / `backend/` / `ai/`) **안의 파일만** 수정.
- `progress.md` 는 트랙별 분리(`docs/progress/fe.md` 등)이라 동시 체크 시도 충돌 0.
- `docs/contracts/`, `docs/steps/`, `docker-compose.yml`, `.env.example` 은 BOOT-000 이후 **읽기 전용**.

### 충돌이 발생할 만한 시나리오와 대응

| 시나리오 | 대응 |
|---|---|
| 2 트랙이 동시에 `docs/contracts/openapi.yaml` 수정 필요 | contract-update step 을 별도로 만들고 한 사람이 담당 (병렬 진행 X). |
| step 중 다른 트랙의 파일이 필요 | 모킹으로 해결. 모킹 불가능하면 contract 업데이트 step 으로 분리. |
| `progress.md` 루트 인덱스 동시 수정 | 루트 progress.md 는 트랙 진행률 요약만, 체크박스는 트랙 파일에. 인덱스는 milestone 단위로만 갱신. |

## 실패 / 거부 처리

### 테스트 3회 실패

에이전트는 같은 step 에 대해 최대 3회 시도. 모두 실패하면:
1. `git stash` 로 작업 보존
2. 사용자에게 실패 원인·시도한 접근법·막힌 지점 보고
3. 사용자 지시 대기 (구현 힌트 추가, step 재정의, 분할 등)

### 사용자 검증 거부

사용자가 검증 단계에서 "거부" 또는 수정 요청하면:
1. `git stash` 로 현재 변경 임시 보관
2. 사용자 피드백 수렴
3. 새 시도 — 처음부터 (TDD red 부터) 또는 부분 수정
4. 다시 검증 → OK 시 stash 해제하지 않고 새 변경 사항으로 commit

## 슬래시 커맨드

`.claude/commands/` 안에 두 개:

- `/project-review` — 세션 시작 시 프로젝트 컨텍스트 로드
- `/step-implement {ID}` — 한 step 의 TDD 사이클 자동 실행

자세한 정의는 각 명령 파일에.

## 사용자 워크플로우 (요약)

```
세션 시작
  ↓
/project-review                    # 에이전트가 docs/, progress, 최근 커밋 읽음
  ↓
"BE-007 진행해줘" 또는 /step-implement BE-007
  ↓
에이전트가 docs/steps/be/BE-007.md 읽고
  ↓
브랜치 생성 → red 테스트 작성 → 실패 확인 → green 구현 → 통과 확인 → refactor
  ↓
사용자에게: "검증 명령: curl localhost:8080/api/feed | jq"
  ↓
사용자 실행 후 "OK" 또는 거부 피드백
  ↓
OK → 자동 commit + push + PR + progress 체크박스 갱신
거부 → git stash + 피드백 반영
  ↓
사용자가 다음 step 명령
```

## 새 작업 환경 셋업 (트랙 시작 시)

[infra/docker-compose.md](../infra/docker-compose.md) 의 절차를 따른 뒤:

1. `git clone <repo> && cd newspick`
2. `docker compose up -d` — DB
3. 자기 트랙 폴더로 이동: `cd backend` (또는 `frontend`, `ai`)
4. 트랙 README 의 setup 섹션 따라 의존성 설치
5. `/project-review` 로 에이전트 컨텍스트 로딩
6. `/step-implement {다음 미완료 step ID}` 로 진행
