import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

const EMAIL_FORMAT_MESSAGE = "올바른 형식의 이메일을 입력해 주세요.";
const EMAIL_EXISTS_MESSAGE = "이미 가입된 이메일입니다.";
const PASSWORD_POLICY_MESSAGE =
  "영문자 시작, 특수문자/대소문자/숫자 포함 8자 이상 입력해 주세요.";
const PASSWORD_CONFIRM_MESSAGE = "비밀번호가 일치하지 않습니다.";
const PHONE_FORMAT_MESSAGE = "올바른 형식의 휴대폰 번호를 입력해 주세요.";
const PHONE_EXISTS_MESSAGE = "이미 등록된 휴대폰 번호입니다.";

const koMessages = {
  loginTitle: "{0}",
  loginTimeout: "로그인 시도가 시간 초과되었습니다. 로그인 절차가 처음부터 시작됩니다.",

  invalidEmailMessage: EMAIL_FORMAT_MESSAGE,
  "error-invalid-email": EMAIL_FORMAT_MESSAGE,
  "profile.attributes.email.pattern.error": EMAIL_FORMAT_MESSAGE,

  emailExistsMessage: EMAIL_EXISTS_MESSAGE,
  "profile.attributes.email.exists": EMAIL_EXISTS_MESSAGE,

  invalidPasswordMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordMinLengthMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordMinDigitsMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordMinLowerCaseCharsMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordMinUpperCaseCharsMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordMinSpecialCharsMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordRegexPatternMessage: PASSWORD_POLICY_MESSAGE,
  invalidPasswordGenericMessage: PASSWORD_POLICY_MESSAGE,
  "profile.attributes.password.pattern.error": PASSWORD_POLICY_MESSAGE,

  notMatchPasswordMessage: PASSWORD_CONFIRM_MESSAGE,
  invalidPasswordConfirmMessage: PASSWORD_CONFIRM_MESSAGE,
  "profile.attributes.passwordConfirm.notMatch": PASSWORD_CONFIRM_MESSAGE,
  "profile.attributes.password-confirm.notMatch": PASSWORD_CONFIRM_MESSAGE,

  "profile.attributes.phoneNumber.pattern.error": PHONE_FORMAT_MESSAGE,
  "profile.attributes.phoneNumber.exists": PHONE_EXISTS_MESSAGE,
  "profile.attributes.phoneNumber.duplicate": PHONE_EXISTS_MESSAGE,
  phoneNumberExistsMessage: PHONE_EXISTS_MESSAGE,

  "profile.attributes.company.required": "회사를 선택해 주세요.",
  "profile.attributes.name.required": "이름을 입력해 주세요.",
  "profile.attributes.email.required": "이메일 ID를 입력해 주세요.",
  "profile.attributes.password.required": "비밀번호를 입력해 주세요.",
  "profile.attributes.passwordConfirm.required": "비밀번호 확인을 입력해 주세요.",
  "profile.attributes.password-confirm.required": "비밀번호 확인을 입력해 주세요.",
  "profile.attributes.phoneNumber.required": "휴대폰 번호를 입력해 주세요.",
  missingUsernameMessage: "이메일 ID를 입력해 주세요.",
  missingEmailMessage: "이메일 ID를 입력해 주세요.",
  missingPasswordMessage: "비밀번호를 입력해 주세요.",
  missingFirstNameMessage: "이름을 입력해 주세요.",

  "error-empty": "필수 입력 항목입니다.",
  "error-invalid-blank": "필수 입력 항목입니다.",
  "error-user-attribute-required": "필수 입력 항목입니다.",
  "error-pattern-no-match": "입력 형식이 올바르지 않습니다.",

  registrationNotAllowedMessage: "회원가입이 허용되지 않습니다.",
  expiredCodeMessage: "로그인 시간 초과. 다시 로그인하세요."
} as const satisfies Record<string, string>;

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withExtraLanguages({
    ko: {
      label: "Korean",
      getMessages: () => import("keycloakify/login/i18n/messages_defaultSet/en")
    }
  })
  .withCustomTranslations({
    ko: koMessages
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
