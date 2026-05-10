---
argument-hint: "<STEP_ID>  e.g. BE-001 / FE-003 / AI-007 / BOOT-000"
description: 한 step 의 TDD 사이클(red→green→test→사용자 OK→commit/push/PR) 을 자율 수행한다.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# /step-implement {STEP_ID}

지정한 step 한 개를 TDD 사이클로 끝까지 진행한다. 동시에 여러 step 은 처리하지 않는다.

## 수행 절차

`{STEP_ID}` 는 `BE-001`, `FE-003`, `AI-007`, `BOOT-000` 같은 형식. 트랙 prefix 로 트랙을 식별 (BE→backend/, FE→frontend/, AI→ai/, BOOT→공용).

### Phase 1 — Step 명세 확보

1. `Read` `docs/steps/{track}/{STEP_ID}.md`. 트랙은 `STEP_ID` 의 prefix 소문자 (`be`, `fe`, `ai`, `boot`).
2. **존재하지 않으면**:
   - `Read` `docs/progress/{track}.md` 에서 해당 ID 의 한 줄 명세 추출.
   - `docs/steps/TEMPLATE.md` 형식대로 step 파일을 **초안 작성**.
   - 사용자에게 초안을 보여주고 "이 명세대로 진행할까요?" 확인 받음.
   - 사용자 OK → 다음 단계. 거부 → step 명세 수정 후 재확인.

### Phase 2 — 사전 점검

1. 현재 브랜치가 `main` 인지 확인 (`git rev-parse --abbrev-ref HEAD`). 다른 step 브랜치라면 사용자에게 알리고 중단.
2. step 의 "사전 조건" 섹션 확인. 선행 step 들이 progress 에서 ✅ 인지 검증. 미완료라면 사용자에게 알리고 중단.

### Phase 3 — 브랜치 생성

```bash
git checkout main
git pull origin main
git checkout -b feat/{track}-{NNN}-{slug}
```

`{slug}` 은 step 제목에서 추출 (소문자 케밥 케이스, 영문/숫자만).

### Phase 4 — Red (실패하는 테스트)

1. step 명세의 "테스트 명세" 그대로 테스트 파일 작성 (구현 코드는 아직 X).
2. 테스트 실행. **실패해야 함** (구현 안 했으니).
   - BE: `cd backend && ./gradlew :test --tests {className}`
   - FE: `cd frontend && pnpm test {filename}`
   - AI: `cd ai && uv run pytest {filename} -v`
3. 만약 의도대로 실패하지 않으면(테스트가 의도와 달리 통과 등) 사용자에게 알림.

### Phase 5 — Green (최소 구현)

1. step 명세의 "파일 대상" + "구현 힌트" 를 따라 최소 구현.
2. 테스트 재실행. **통과해야 함**.
3. 통과하지 않으면 다시 시도. **3회 실패** 시 Phase 9 (실패 처리) 로 이동.

### Phase 6 — Refactor

1. 구현 코드의 가독성·중복·네이밍을 정리.
2. 다른 테스트도 깨지지 않는지 전체 테스트 재실행 (해당 트랙만).

### Phase 7 — 사용자 검증 요청

step 명세의 "검증 방법" 섹션을 사용자에게 그대로 제시:

```
✅ 자동 테스트 통과: <테스트 명령>
🔍 수동 확인:
   <명령 또는 절차>
   기대 결과: ...

검증 후 "OK" 또는 수정 사항을 알려주세요.
```

**여기서 멈추고 사용자 응답을 기다린다.**

### Phase 8 — Done (사용자 OK 후)

1. 자동 commit:
   ```bash
   git add .
   git commit -m "feat({track}): {STEP_ID} {step 제목}"
   ```
2. 자동 push:
   ```bash
   git push -u origin feat/{track}-{NNN}-{slug}
   ```
3. PR 자동 생성:
   ```bash
   gh pr create \
     --title "{STEP_ID} {step 제목}" \
     --body "Step: {STEP_ID}\n\n{step 목표 한 문단}\n\n## 검증\n- 자동 테스트 통과\n- 사용자 검증 OK\n\nCloses progress: docs/progress/{track}.md" \
     --base main
   ```
4. `docs/progress/{track}.md` 에서 해당 step 의 `[ ]` 를 `[x]` 로 변경 후:
   ```bash
   git add docs/progress/{track}.md
   git commit -m "chore: mark {STEP_ID} as done"
   git push
   ```
5. 사용자에게 PR URL + 다음 후보 step 보고.

### Phase 9 — 실패 처리 (테스트 3회 실패)

1. `git stash push -u -m "step {STEP_ID} attempt failed"` 로 작업 보존.
2. 사용자에게:
   - 시도한 접근법 3가지 요약
   - 막힌 지점·에러 메시지
   - 다음 옵션: (a) 구현 힌트 추가 후 재시도 (b) step 분할 (c) step 재정의 (d) 다른 step 으로 이동
3. 사용자 지시 대기.

### Phase 10 — 검증 거부 처리

사용자가 검증 단계에서 거부 또는 수정 요청:
1. `git stash push -u -m "step {STEP_ID} verification rejected"` 로 보관.
2. 피드백 수렴 → 새 시도 (Phase 4 또는 Phase 5 부터).
3. 다시 검증 통과 시 stash 무시 (새 변경으로 commit).

## 절대 규칙

- step.md 의 "파일 대상" 에 명시되지 않은 파일은 **수정하지 않는다**. 다른 트랙 디렉토리는 절대 건드리지 않는다.
- `docs/contracts/` 안의 파일은 **읽기만**. 수정 필요 시 사용자에게 알리고 별도 contract-update step 제안.
- 테스트 없이 구현하지 않는다 (TDD red 우선).
- 사용자 OK 없이 commit/push 하지 않는다.
- `--no-verify`, `--force`, `git reset --hard` 같은 파괴적 명령 사용 금지.

## 입력 검증

`{STEP_ID}` 가 다음 패턴에 맞지 않으면 즉시 사용자에게 형식 안내:
- `^(BE|FE|AI)-\d{3}$` 또는 `^BOOT-000$`

여러 step ID 가 들어오면 (`BE-001 BE-002` 등) "단일 step 만 지원합니다" 안내.
