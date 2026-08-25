import type { CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import LoginHeader from "../components/LoginHeader";
import SystemErrorAlert from "../components/SystemErrorAlert";
import TotpAuthForm from "../components/TotpAuthForm";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const PAGE_CONFIG = {
  title: "OTP 등록",
  description: "Google OTP 앱 설치 후, 우측 하단의 + 버튼을 눌러 \n QR코드를 스캔하거나 설정 키를 직접 입력해 주세요 ."
};

const styles: Record<string, CSSProperties> = {
  loginWrapper: {
    width: 480,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 48,
    padding: 28,
    borderRadius: "var(--radius-8)",
    backgroundColor: "var(--color-light-surface-white)",
    boxShadow: "0 1px 4px 0 var(--color-light-alpha-shadow1), 0 2px 6px 0 var(--color-light-alpha-shadow2)"
  }
};

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, totp, mode, messagesPerField, message } = kcContext;
  const otpError = messagesPerField.getFirstError("totp", "userLabel");
  const hasOtpError = otpError !== undefined;
  const errorMessage = hasOtpError ? kcSanitize(otpError) : undefined;
  const systemMessage = hasOtpError ? undefined : message;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div
        style={{
          padding: "80px 0",
          backgroundColor: "var(--color-light-background-neutral-weakest)"
        }}
      >
        <div style={styles.loginWrapper}>
          <div style={styles.loginContainer}>
            <LoginHeader title={PAGE_CONFIG.title} userId={totp.username} description={PAGE_CONFIG.description} />
            <SystemErrorAlert message={systemMessage} />
            <TotpAuthForm
              action={url.loginAction}
              qrCodeSrc={`data:image/png;base64, ${totp.totpSecretQrCode}`}
              secret={totp.totpSecretEncoded}
              errorMessage={errorMessage}
            >
              <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
              {mode && <input type="hidden" id="mode" name="mode" value={mode} />}
              {totp.otpCredentials.length >= 1 && <input type="hidden" id="userLabel" name="userLabel" value={totp.username} />}
              <input type="hidden" id="logout-sessions" name="logout-sessions" value="on" />
            </TotpAuthForm>
          </div>
        </div>
      </div>
    </Template>
  );
}
