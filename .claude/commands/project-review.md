---
description: 세션 시작 시 NewPick 프로젝트 컨텍스트를 로드한다. docs/, progress.md, 최근 커밋을 읽어 트랙별 현황과 다음 step 후보를 보고한다.
allowed-tools: Read, Glob, Grep, Bash
---

# /project-review

NewPick 프로젝트의 현재 상태를 빠르게 파악한다. 세션이 시작될 때 가장 먼저 호출하는 명령.

## 수행 절차

다음을 **이 순서대로** 수행:

### 1. 핵심 인덱스 읽기

병렬로:
- `Read` `docs/README.md` (전체 구조와 기술 스택 요약)
- `Read` `progress.md` (마스터 진행 상황)
- `Read` `docs/process/development-flow.md` (방법론 — TDD 사이클, 브랜치 전략)

### 2. 트랙별 진행 상황

병렬로:
- `Read` `docs/progress/boot.md`
- `Read` `docs/progress/be.md`
- `Read` `docs/progress/fe.md`
- `Read` `docs/progress/ai.md`

각 트랙의 미완료(`[ ]`) step 중 가장 ID 가 낮은 것이 다음 후보.

### 3. 계약 동결 상태 확인

`Glob` `docs/contracts/**/*` 로 파일 목록 확인. README, openapi.yaml, python-ai.yaml, sse-events.md, db-init.sql, json-schemas/* 가 모두 존재해야 한다.

### 4. 최근 git 활동

`Bash`:
```bash
git log --oneline -5
git status --short
git branch --show-current
```

현재 브랜치가 main 인지, 작업 중인 step 브랜치가 있는지 보고.

### 5. 보고서 형식

사용자에게 한 메시지로 요약:

```
## NewPick 프로젝트 현황

**기술 스택**: Spring 3.4 / Next 15 / Python 3.12 / Solar API / pgvector / Docker DB
**현재 단계**: Phase C — 실제 코드 구현
**현재 브랜치**: <branch>

**트랙별 진행률**
- BOOT: 0/1 (BOOT-000 미완료) ← 시작 전 필수
- BE:   0/8
- FE:   0/8
- AI:   0/8

**다음 진행 가능한 step**
- BOOT-000 (선행 — 다른 트랙 시작 전 필요)
- 또는 BE-001 / FE-001 / AI-001 (BOOT-000 완료 후 병렬 가능)

**최근 커밋 5개**
- abc1234 feat(...): ...
...

**작업 시작 명령**
- `/step-implement BOOT-000`
```

### 6. 추가 컨텍스트가 필요한 경우

사용자가 다음 step 을 명시하면, 그 트랙의 도메인 문서를 추가로 읽기:
- BE step 시작 → `docs/backend/*.md` 4~5개
- FE step 시작 → `docs/frontend/*.md` + `docs/design.md`
- AI step 시작 → `docs/ai/*.md` 6개 + `docs/architecture/pipeline-design.md`

이는 `/project-review` 가 아니라 `/step-implement` 가 필요 시 자동으로 한다.

## 주의

- 본 명령은 **읽기만** 한다. 어떤 파일도 생성·수정·삭제하지 않는다.
- 보고서는 간결하게 (10~15줄). 사용자가 빠르게 다음 행동을 결정할 수 있게.
- 사용자가 묻지 않은 분석·추천은 하지 않는다.
