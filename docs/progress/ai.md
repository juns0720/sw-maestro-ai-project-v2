# AI 진행 (Python LangGraph)

> 디렉토리: `ai/`. Solar API 호출은 langchain-upstage SDK 의 fake mode 또는 VCR 카세트로 모킹.

## 초기 시드 (Milestone M2 까지)

- [ ] **AI-001** FastAPI 스켈레톤 + `/health` 엔드포인트 + pytest httpx 테스트 — [docs/steps/ai/AI-001.md](../steps/ai/AI-001.md)
- [ ] **AI-002** Solar `ChatUpstage` 호출 헬퍼 (1문장 입력 → 1문장 출력) + VCR 모킹 테스트
- [ ] **AI-003** `UpstageEmbeddings` 헬퍼 (passage/query 분리) + 4096차원 출력 검증
- [ ] **AI-004** LangGraph 빈 graph + 1개 노드(Collector mock) + State 정의 + pytest
- [ ] **AI-005** RSS 1개 피드 fetch (feedparser) + Collector 노드 통합 + 테스트
- [ ] **AI-006** Deduplicator 노드 (URL 기준) + 단위 테스트
- [ ] **AI-007** `/refresh-stream` SSE 엔드포인트 — fake graph 가 step/done 이벤트 발행 + 통합 테스트
- [ ] **AI-008** Persistor 노드 — asyncpg 로 DB 에 빈 article row 1건 INSERT (Testcontainers PG)

## Milestone M3 이후 (추가 예정)

- ArticleExtractor (본문 파싱)
- Summarizer (Solar 호출)
- SummaryValidator (Solar 호출)
- EmbeddingGenerator
- QuizGenerator (Solar 호출)
- 데일리 리포트 graph (ArticleClusterer/HDBSCAN/TrendSummarizer/DailyReportGenerator/ReportPersistor)
- RAG 챗 graph (QueryEmbedder/ArticleRetriever/ContextBuilder/ResponseGenerator/StreamResponder)

## 의존성

- 시작 전 BOOT-000 완료 필요.
- BE 트랙과의 인터페이스는 [docs/contracts/python-ai.yaml](../contracts/python-ai.yaml) 에 동결.
- DB 스키마는 [docs/contracts/db-init.sql](../contracts/db-init.sql) 동결 (Flyway 가 BE-001 에서 적용하지만, AI 측 테스트는 같은 DDL 을 Testcontainers 에서 사용).
- Solar API 키(`UPSTAGE_API_KEY`)는 `.env` 로 받음. CI/테스트는 VCR 카세트.
