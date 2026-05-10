# NewPick 개발 진행 상황 (마스터 인덱스)

> 트랙별 상세 체크리스트는 `docs/progress/{track}.md` 참고. 본 파일은 milestone 단위 요약만 갱신한다.

## 현재 단계

**Phase C — 실제 코드 구현**

방법론: [docs/process/development-flow.md](docs/process/development-flow.md)

## Track 진행 요약

| 트랙 | 진행률 | 상세 |
|---|---|---|
| **BOOT** (공용 부트스트랩) | 0/1 | [docs/progress/boot.md](docs/progress/boot.md) |
| **BE** (Spring Boot) | 0/8 | [docs/progress/be.md](docs/progress/be.md) |
| **FE** (Next.js) | 0/8 | [docs/progress/fe.md](docs/progress/fe.md) |
| **AI** (Python LangGraph) | 0/8 | [docs/progress/ai.md](docs/progress/ai.md) |

> 초기 시드는 트랙당 5~8 step. 필요 시 점진적으로 추가한다.

## Milestone

- [ ] **M1**: BOOT-000 완료 — 모든 트랙이 병렬 개발 가능 상태
- [ ] **M2**: 각 트랙 초기 시드 step 완료 — 걸어다니는 뼈대 (빈 응답, 빈 화면, 빈 파이프라인이지만 모두 통신)
- [ ] **M3**: 첫 기사 1건이 RSS → 요약 → 홈 카드 → 상세까지 흐름 (E2E happy path)
- [ ] **M4**: 인라인 퀴즈 동작
- [ ] **M5**: 데일리 리포트 생성·표시
- [ ] **M6**: AI 챗 RAG 동작
- [ ] **M7**: 시연 데이터 고정 ([product/demo-strategy.md](docs/product/demo-strategy.md)) + 발표 리허설

## 슬래시 커맨드

- `/project-review` — 세션 시작 시 컨텍스트 로딩 ([.claude/commands/project-review.md](.claude/commands/project-review.md))
- `/step-implement {ID}` — 한 step TDD 사이클 ([.claude/commands/step-implement.md](.claude/commands/step-implement.md))

## 기술 스택 요약

| 레이어 | 선택 |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind v4 + Zustand + TanStack Query (pnpm) |
| Backend | Spring Boot 3.4 + Java 17 + Gradle + Flyway + JPA + SseEmitter |
| AI | Python 3.12 + FastAPI + LangGraph + langchain-upstage + LangSmith |
| LLM | Upstage Solar (`solar-pro2`) |
| 임베딩 | Solar (`solar-embedding-1-large-{passage,query}`, 4096-dim) |
| DB | PostgreSQL 16 + pgvector (Docker `pgvector/pgvector:pg16`) |
| 인증 | 없음 (MVP) |

상세: [docs/README.md](docs/README.md)
