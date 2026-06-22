# CPOS Keycloak Login Theme

Keycloakify를 사용한 커스텀 Keycloak 로그인 테마 프로젝트입니다. React와 TypeScript로 구축되어 있으며, 소셜 로그인 기능과 커스텀 스타일링을 포함합니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **Keycloakify** - Keycloak 테마 개발 도구
- **Vite** - 빌드 도구

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상 또는 20.0.0 이상
- Yarn
- Maven (Keycloak 빌드를 위해 필요)

### 설치

```bash
# 의존성 설치 Yarn 사용
yarn install
```

### 개발

#### 1. 페이지 추출

Keycloak 페이지를 커스터마이징하려면 먼저 해당 페이지를 추출해야 합니다:

```bash
npx keycloakify eject-page
```

이 명령어를 실행하면 Keycloak의 기본 페이지들을 프로젝트로 추출하여 커스터마이징할 수 있게 됩니다.

#### 2. 개발 서버 실행

```bash
yarn dev
```

### 빌드

#### 개발용 빌드

```bash
yarn build
```

#### Keycloak용 빌드

```bash
yarn keycloak
```

빌드된 JAR 파일은 `build_keycloak/keycloak-theme.jar`에 생성됩니다. 이 파일을 Keycloak 서버의 `providers` 디렉토리에 복사해야 합니다.

`providers/cpos-login-theme_v****.jar`
Keycloak 에 업로드 후 Keycloak 서버를 재시작합니다.

## 프로젝트 구조

```
src/
├── component/          # 재사용 가능한 컴포넌트
│   ├── StyledLogin.tsx
│   └── StyledTemplate.tsx
├── images/            # 이미지 리소스
│   ├── icons-google.png
│   └── kakao_login_large_wide.png
├── login/             # 로그인 관련 페이지와 로직
│   ├── i18n.ts        # 국제화 설정
│   ├── KcApp.css      # 앱 스타일
│   ├── KcContext.ts   # Keycloak 컨텍스트
│   ├── KcPage.tsx     # 메인 페이지 컴포넌트
│   ├── Template.tsx   # 페이지 템플릿
│   └── pages/         # 개별 페이지 컴포넌트
│       └── Login.tsx
├── kc.gen.tsx         # Keycloak 생성 파일
└── main.tsx           # 앱 진입점
```

## 커스터마이징 가이드

### 새로운 페이지 추가

1. 먼저 해당 페이지를 추출합니다:

   ```bash
   npx keycloakify eject-page
   ```

2. `src/login/pages/` 디렉토리에 새로운 페이지 컴포넌트를 생성합니다.

3. `src/login/KcPage.tsx`에서 새로운 페이지를 등록합니다.

```bash
npx keycloakify add-story   # Storybook 스토리 추가 명령어
```

### 스타일 수정

- 전역 스타일: `src/login/KcApp.css`
- 컴포넌트별 스타일: Styled Components 사용
- 테마 변수: CSS 커스텀 프로퍼티 활용
