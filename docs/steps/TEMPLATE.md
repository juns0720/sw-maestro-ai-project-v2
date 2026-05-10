# {ID} — {제목}

> 본 파일은 step 템플릿. 실제 step 파일 작성 시 이 6 섹션 구조를 그대로 사용한다.

## 목표

이 step 이 무엇을 달성하는지 한 문단으로. 사용자 가치 또는 시스템 능력 단위로 작성. "X 가 Y 할 수 있다" 형태.

## 사전 조건

- 선행 step 목록: 예) `BE-003 완료`, `BOOT-000 완료`
- 외부 의존: 예) `Solar API 키 보유`, `localhost:5432 DB healthy`
- 트랙 외부 의존이 있다면 모킹으로 해소 가능한지 명시

## 파일 대상

이 step 이 만들거나 수정하는 파일 경로 (트랙 디렉토리 내부에 한정):

```
backend/src/main/java/com/newspick/article/Article.java     [신규]
backend/src/main/java/com/newspick/article/ArticleRepository.java  [신규]
backend/src/test/java/com/newspick/article/ArticleRepositoryTest.java [신규]
```

> 다른 트랙(`frontend/`, `ai/`) 파일은 절대 등장하지 않는다.

## 테스트 명세

**TDD red 단계에서 작성할 테스트.** given/when/then 으로:

- **테스트 파일**: `backend/src/test/java/com/newspick/article/ArticleRepositoryTest.java`
- **테스트 이름**: `save_then_findById_returnsArticle`
- **given**: `articles` 테이블이 비어있다 (Testcontainers 새 DB)
- **when**: `Article` 1건을 `save()` 후 같은 id 로 `findById()`
- **then**: 반환된 `Optional<Article>` 이 isPresent 이고 모든 필드가 일치

(여러 테스트가 필요하면 위 블록을 반복)

## 구현 힌트

구현 시 참고할 자료:
- 관련 docs: [architecture/data-schema.md](../../architecture/data-schema.md), [backend/jpa.md](../../backend/jpa.md)
- 라이브러리: hypersistence-utils 의 `JsonBinaryType`
- 패턴: `@Type(JsonBinaryType.class)` 로 jsonb 컬럼 매핑
- 주의: `embedding vector(4096)` 컬럼은 매핑하지 않는다 (`@Transient`)

코드 스니펫이 필요하면 추가:

```java
@Entity
@Table(name = "articles")
public class Article { ... }
```

## 검증 방법

사용자가 OK 판단을 위해 실행할 명령:

**자동 테스트**:
```bash
cd backend
./gradlew :test --tests com.newspick.article.ArticleRepositoryTest
```
기대: 1 test pass.

**수동 확인**:
```bash
# DB 에 직접 INSERT 후 SELECT
docker exec -it newspick-db psql -U newspick -d newspick \
  -c "INSERT INTO articles (id, url, title, source, category, published_at, status) VALUES ('test_001', 'https://x', '제목', 'src', '테크', now(), 'collected');"
```
기대: `INSERT 0 1` 출력. 이후 Spring 재시작 후 `ArticleRepository.findById("test_001")` 결과 비어있지 않음.

(또는 시각 확인이면) "브라우저에서 http://localhost:3000 열어서 X 가 Y 위치에 보이는지 확인".
