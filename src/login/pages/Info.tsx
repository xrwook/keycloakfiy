import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { advancedMsgStr, msg } = i18n;

  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client, resultType, loginUrl } = kcContext;
  // const { resultType, loginUrl, actionUri, client, message } = kcContext;
  const moveUrl = loginUrl ?? actionUri ?? client?.baseUrl;
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
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={
        <span
          dangerouslySetInnerHTML={{
            __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
          }}
        />
      }
    >
      <div id="kc-info-message">
        <p
          className="instruction"
          dangerouslySetInnerHTML={{
            __html: kcSanitize(
              (() => {
                let html = message.summary?.trim();

                if (requiredActions) {
                  html += " <b>";

                  html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");

                  html += "</b>";
                }

                return html;
              })()
            )
          }}
        />
        {(() => {
          if (skipLink) {
            return null;
          }

          if (pageRedirectUri) {
            return (
              <p>
                <a href={pageRedirectUri}>{msg("backToApplication")}</a>
              </p>
            );
          }
          if (actionUri) {
            return (
              <p>
                <a href={actionUri}>{msg("proceedWithAction")}</a>
              </p>
            );
          }

          if (client.baseUrl) {
            return (
              <p>
                <a href={client.baseUrl}>{msg("backToApplication")}</a>
              </p>
            );
          }
        })()}
      </div>
    </Template>
  );
}

