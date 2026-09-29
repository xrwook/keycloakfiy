import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";
import koMessages from "./i18n.ko.json";

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
    ko: {
      ...koMessages,
      // 메일 클릭시 info.ftl
      confirmEmailAddressVerificationHeader: "이메일 주소 확인",
      confirmEmailAddressVerification: "이메일 주소 {0}의 유효성을 확인합니다.",

      // info.ftl 의 click here to proceed 클릭시
      emailVerifiedMessageHeader: "이메일이 확인되었습니다.",
      emailVerifiedMessage: "귀하의 이메일 주소가 확인되었습니다.",

      // 언제뜨는지 잘모르겠음 (아마 이미 이메일이 확인된 경우)
      emailVerifiedAlreadyMessageHeader: "귀하의 이메일 주소는 이미 확인되었습니다.",
      emailVerifiedAlreadyMessage: "귀하의 이메일 주소는 이미 확인되었습니다.",
      infoLoginButton: "로그인 화면으로 이동"
    }
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
