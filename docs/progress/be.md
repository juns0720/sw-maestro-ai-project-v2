# BE 진행 (Spring Boot)

> 디렉토리: `backend/`. 다른 트랙(`frontend/`, `ai/`)을 건드리는 step 은 없다.
>
> Python AI 서비스는 WireMock 으로 모킹.

## 초기 시드 (Milestone M2 까지)

- [ ] **BE-001** Flyway V1 init — `articles`, `daily_reports` 테이블 생성 + 통합 테스트로 스키마 검증 — [docs/steps/be/BE-001.md](../steps/be/BE-001.md)
- [ ] **BE-002** `Article` 엔티티 + 리포지토리 + 단위 테스트 (`save → findById`)
- [ ] **BE-003** `GET /api/feed` 빈 배열 응답 + MockMvc 테스트
- [ ] **BE-004** `GET /api/feed` 가 DB 의 articles 를 status='summarized' 필터로 반환 + Testcontainers 통합 테스트
- [ ] **BE-005** `GET /api/articles/{id}` + 404 처리 + 테스트
- [ ] **BE-006** `PythonAiClient` (RestClient) — `/refresh-stream` GET (mock) + WireMock 테스트
- [ ] **BE-007** `GET /api/refresh-stream` SseEmitter 가 WireMock 의 SSE 이벤트를 그대로 프록시 + 테스트
- [ ] **BE-008** `GET /api/report/today` — DailyReport 조회 + 빈 결과 처리 + 테스트

## Milestone M3 이후 (추가 예정)

- 챗 SSE 프록시
- 에러 핸들링 정책
- (기타 - 추후 enumeration)

## 의존성

- 시작 전 BOOT-000 완료 필요.
- 이 트랙 안에서는 BE-001 → 002 → 003 ... 순차 진행 권장 (DB 가 먼저 있어야 엔티티가 의미 있음).
- AI 트랙과의 인터페이스는 모두 [docs/contracts/python-ai.yaml](../contracts/python-ai.yaml) 에 동결되어 있어 모킹으로 진행.
