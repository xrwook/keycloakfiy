import { Button, TextField } from "@hae-fe/elements";
import { IconPassword } from "@hae-fe/icon-library/react";
import { useState, type ChangeEvent, type CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import LoginHeader from "../components/LoginHeader";
import SystemErrorAlert from "../components/SystemErrorAlert";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const PAGE_CONFIG = {
  title: "비밀번호 재설정",
  description: "새 비밀번호를 입력해 주세요."
};

const PASSWORD_GUIDE_TEXT = "영문자 시작, 특수문자/대소문자/숫자 포함\n8자 이상의 비밀번호를 입력해주세요.";
const PASSWORD_CONFIRM_ERROR_MESSAGE = "비밀번호가 일치하지 않습니다.";

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
  },
  formContent: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    textAlign: "center"
  },
  iconBox: {
    padding: 12,
    borderRadius: "var(--radius-4)"
  },
  guide: {
    fontSize: 15,
    lineHeight: "20px",
    whiteSpace: "pre-line",
    color: "var(--color-light-text-neutral-stronger)"
  },
  fields: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: 10
  },
  buttonRow: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 32
  }
};

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, auth, messagesPerField, message } = kcContext;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const hasPasswordError = messagesPerField.existsError("password", "password-new");
  const hasPasswordConfirmServerError = messagesPerField.existsError("password-confirm");
  const hasPasswordConfirmError = passwordMismatch || hasPasswordConfirmServerError;
  const passwordErrorText = hasPasswordError ? messagesPerField.getFirstError("password", "password-new").trim() : "";
  const passwordConfirmServerErrorText = hasPasswordConfirmServerError ? messagesPerField.getFirstError("password-confirm").trim() : "";
  const passwordErrorMessage = passwordErrorText ? kcSanitize(passwordErrorText) : undefined;
  const passwordConfirmErrorMessage = hasPasswordConfirmError
    ? hasPasswordConfirmServerError
      ? passwordConfirmServerErrorText
        ? kcSanitize(passwordConfirmServerErrorText)
        : undefined
      : PASSWORD_CONFIRM_ERROR_MESSAGE
    : undefined;
  const hasFieldError = hasPasswordError || hasPasswordConfirmError;
  const systemMessage = hasFieldError ? undefined : message;
  const userId = auth?.attemptedUsername;

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleClearNewPassword = () => {
    setNewPassword("");
  };

  const handleClearConfirmPassword = () => {
    setConfirmPassword("");
  };

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
            <LoginHeader title={PAGE_CONFIG.title} userId={userId} description={PAGE_CONFIG.description} />
            <SystemErrorAlert message={systemMessage} />

            <form id="kc-passwd-update-form" action={url.loginAction} method="post">
              <div className="flex w-full flex-col items-center gap-4 text-center" style={styles.formContent}>
                <div
                  style={{
                    ...styles.iconBox,
                    backgroundColor: hasFieldError ? "var(--color-light-graphic-red-weakest)" : "var(--color-light-graphic-primary-weakest)"
                  }}
                >
                  <IconPassword
                    size={32}
                    color={hasFieldError ? "var(--color-light-icon-attention-strong)" : "var(--color-light-icon-brand-strong-01)"}
                  />
                </div>

                <p className="text-[15px] leading-5 whitespace-pre-line text-(--color-light-text-neutral-stronger)" style={styles.guide}>
                  {PASSWORD_GUIDE_TEXT}
                </p>

                <div className="flex w-full flex-col gap-2.5" style={styles.fields}>
                  <TextField
                    id="password-new"
                    name="password-new"
                    placeholder="비밀번호를 입력해 주세요"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    autoFocus
                    autoComplete="new-password"
                    hdsProps={{
                      clearable: true,
                      size: "xlarge",
                      helpText: passwordErrorMessage
                    }}
                    onClear={handleClearNewPassword}
                    error={hasPasswordError}
                  />
                  <TextField
                    id="password-confirm"
                    name="password-confirm"
                    placeholder="다시 한 번 입력해주세요"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    autoComplete="new-password"
                    hdsProps={{
                      clearable: true,
                      size: "xlarge",
                      helpText: passwordConfirmErrorMessage
                    }}
                    onClear={handleClearConfirmPassword}
                    error={hasPasswordConfirmError}
                  />
                </div>

                <input type="hidden" id="logout-sessions" name="logout-sessions" value="on" />
                <div className="mt-8 flex w-full items-center justify-end gap-2" style={styles.buttonRow}>
                  <Button
                    disabled={!newPassword.trim() || !confirmPassword.trim() || passwordMismatch}
                    type="submit"
                    size="xlarge"
                    semantic="brand"
                    styleOption="fill"
                  >
                    확인
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
