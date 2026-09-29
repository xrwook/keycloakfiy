import { Button, Typography } from "@hae-fe/elements";
import { Icon3dSecurity } from "@hae-fe/icon-library/react/3d";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type InfoState = "emailVerify" | "emailVerified" | "emailAlreadyVerified" | "defaultInfo";

function normalizeMessageText(message: string) {
  return message
    .trim()
    .replace(/\\n/g, "\n")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/&lt;br\s*\/?&gt;/gi, "\n");
}

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { advancedMsgStr, msg } = i18n;

  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client, resultType, loginUrl } = kcContext;

  const infoState: InfoState = (() => {
    const isEmailVerifyScreen = !!actionUri && actionUri.includes("/login-actions/action-token");

    if (isEmailVerifyScreen || requiredActions?.includes("VERIFY_EMAIL")) {
      return "emailVerify";
    }

    const isEmailVerified = !actionUri && message.type === "success" && !(pageRedirectUri || client?.baseUrl);

    if (isEmailVerified) {
      return "emailVerified";
    }

    const resolvedMessageHeader = messageHeader ? advancedMsgStr(messageHeader) : "";
    const alreadyVerifiedTexts = [advancedMsgStr("emailVerifiedAlreadyMessageHeader"), advancedMsgStr("emailVerifiedAlreadyMessage")];
    const isEmailAlreadyVerified =
      !actionUri && message.type === "info" && alreadyVerifiedTexts.some(text => text === resolvedMessageHeader || text === message.summary);

    if (isEmailAlreadyVerified) {
      return "emailAlreadyVerified";
    }

    return "defaultInfo";
  })();

  const messageHeaderText = messageHeader ? advancedMsgStr(messageHeader) : "";
  let messageSummaryText = normalizeMessageText(message.summary ?? "");

  if (infoState === "emailVerify" && !/\n/.test(messageSummaryText)) {
    messageSummaryText = messageSummaryText.replace(/([\w.%+-]+@[\w.-]+\.[A-Za-z]{2,})/, "\n$1");
  }

  const requiredActionsText = requiredActions?.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");
  const moveUrl = pageRedirectUri ?? actionUri ?? loginUrl ?? client?.baseUrl;
  const buttonText = pageRedirectUri ? msg("backToApplication") : actionUri ? msg("proceedWithAction") : advancedMsgStr("infoLoginButton");
  if (resultType === "otp-reset-email-sent") {
    return (
      <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={false} headerNode={null}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <div>
            <div style={{ fontSize: 48 }}>✅</div>
            <h1>OTP 재설정 메일을 발송했습니다.</h1>
            <p>
              메일의 링크를 통해 비밀번호를 재설정한 후
              <br />
              OTP 설정을 진행해 주세요.
            </p>
            {moveUrl && <a href={moveUrl}>로그인 화면으로 이동</a>}
          </div>
        </main>
      </Template>
    );
  }

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <Icon3dSecurity style={{ width: "240px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              <span dangerouslySetInnerHTML={{ __html: kcSanitize(messageHeaderText) }} />
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              <div style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: kcSanitize(messageSummaryText) }} />
              {requiredActionsText && <div style={{ whiteSpace: "pre-line" }}>{requiredActionsText}</div>}
            </Typography>
            {!skipLink && moveUrl && (
              <Button
                className="mt-6"
                size="large"
                semantic="neutral"
                styleOption="outline"
                onClick={() => {
                  window.location.href = moveUrl;
                }}
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Template>
  );
}
