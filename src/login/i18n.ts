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
    ko: koMessages
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
