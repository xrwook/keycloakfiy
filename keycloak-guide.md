# Keycloakify 적용 가이드

## FSD 퍼블 산출물 적용 방향

Keycloakify 쪽에 FSD 구조를 억지로 적용할 필요는 없다.

FSD로 퍼블된 코드는 Keycloakify 프로젝트 구조로 그대로 옮기기보다는, 디자인과 마크업, 스타일을 참고하는 소스로 보고 Keycloakify에 맞게 재구성하는 방식이 적합하다.

## 적용 원칙

- 퍼블 산출물의 FSD 구조는 참고용으로만 본다.
- 실제 Keycloakify 테마 안에서는 `login/pages`, `components`, `assets`, `styles` 정도로 단순화한다.
- 공통 UI만 필요한 만큼 컴포넌트로 분리한다.
- 나머지는 Keycloak 페이지 단위로 붙인다.
- 기존 `class`는 최대한 유지한다.
- 기존 디자인은 최대한 변경하지 않는다.
- 최우선 기준은 Keycloakify의 동작 흐름이다.
- Keycloakify의 `kcContext`, `messagesPerField`, `url.loginAction`, `realm`, `auth`, `social` 같은 흐름을 우선한다.

## 우선순위

1. Keycloakify 흐름과 Keycloak 동작을 우선한다.
2. 기존 디자인과 퍼블리싱 결과물을 최대한 유지한다.
3. 기존 `class`를 최대한 유지한다.
4. FSD 구조는 필요한 경우에만 참고하고, Keycloakify 내부 구조로 단순화한다.

## 이유

로그인 테마는 일반적인 프론트엔드 서비스 화면보다 범위가 좁고, Keycloak이 제공하는 컨텍스트와 폼 액션 흐름에 강하게 의존한다.

따라서 FSD 구조를 유지하려고 하면 다음 문제가 생길 수 있다.

- 로그인 테마에 비해 구조가 과해진다.
- Keycloakify 페이지별 연결이 불편해진다.
- Keycloakify 업그레이드나 유지보수 시 수정 범위가 커질 수 있다.
- Keycloak 고유의 `kcContext` 흐름보다 프론트엔드 구조가 앞서게 될 수 있다.

## 정리

FSD로 퍼블된 코드는 그대로 유지하지 않고, Keycloakify 구조에 맞게 단순화해서 적용한다.

즉, FSD는 “디자인/마크업/스타일 소스”로 활용하고, 실제 구현은 Keycloakify의 페이지 구조와 컨텍스트 흐름을 기준으로 구성한다.
