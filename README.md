# CPOS Keycloak Login Theme

Keycloakify를 사용한 커스텀 Keycloak 로그인 테마 프로젝트입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **Keycloakify** - Keycloak 테마 개발 도구
- **Vite** - 빌드 도구

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상 또는 20.0.0 이상
- pnpm
- Maven (Keycloak 빌드를 위해 필요)

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발

#### 1. 페이지 추출

Keycloak 페이지를 커스터마이징하려면 먼저 해당 페이지를 추출해야 합니다:

```bash
pnpm exec keycloakify eject-page
```

이 명령어를 실행하면 Keycloak의 기본 페이지들을 프로젝트로 추출하여 커스터마이징할 수 있게 됩니다.

#### 2. 개발 서버 실행

```bash
pnpm dev
```

### 빌드

#### 개발용 빌드

```bash
pnpm build
```

#### Keycloak용 빌드

```bash
pnpm keycloak
```

빌드된 JAR 파일은 `build_keycloak/keycloak-theme.jar`에 생성됩니다. 이 파일을 Keycloak 서버의 `providers` 디렉토리에 복사해야 합니다.

`providers/cpos-login-theme_v****.jar`
Keycloak 에 업로드 후 Keycloak 서버를 재시작합니다.

## 커스터마이징 가이드

### 새로운 페이지 추가

1. 먼저 해당 페이지를 추출합니다:

   ```bash
   pnpm exec keycloakify eject-page
   ```

2. `src/login/pages/` 디렉토리에 새로운 페이지 컴포넌트를 생성합니다.

3. `src/login/KcPage.tsx`에서 새로운 페이지를 등록합니다.

4. 스토리북에 새로운 페이지를 추가하려면 다음 명령어를 실행합니다

```bash
pnpm exec keycloakify add-story
```
