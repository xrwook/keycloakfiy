import type { CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import LoginHeader from "../components/LoginHeader";
import OtpAuthForm from "../components/OtpAuthForm";
import SystemErrorAlert from "../components/SystemErrorAlert";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const PAGE_CONFIG = {
  title: "OTP 인증",
  description: "계속 하려면 인증을 진행해 주세요."
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

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { auth, otpLogin, url, messagesPerField, message } = kcContext;
  const otpError = messagesPerField.getFirstError("totp", "otp");
  const hasOtpError = otpError !== undefined;
  const errorMessage = hasOtpError ? kcSanitize(otpError) : undefined;
  const systemMessage = hasOtpError ? undefined : message;
  const selectedCredentialId = otpLogin.selectedCredentialId ?? otpLogin.userOtpCredentials[0]?.id;

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
            <LoginHeader title={PAGE_CONFIG.title} userId={auth?.attemptedUsername} description={PAGE_CONFIG.description} />
            <SystemErrorAlert message={systemMessage} />
            <OtpAuthForm action={url.loginAction} errorMessage={errorMessage}>
              {selectedCredentialId !== undefined && <input type="hidden" name="selectedCredentialId" value={selectedCredentialId} />}
            </OtpAuthForm>
          </div>
        </div>
      </div>
    </Template>
  );
}
