import { Button, TextField } from "@hae-fe/elements";
import { IconProfile } from "@hae-fe/icon-library/react";
import { useState, type ChangeEvent, type CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import LoginHeader from "../components/LoginHeader";
import SystemErrorAlert from "../components/SystemErrorAlert";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const PAGE_CONFIG = {
  title: "비밀번호 재설정",
  description: "비밀번호 재설정 링크가 포함된 메일이 발송됩니다.\n발송된 메일에 링크를 통해 비밀번호를 재설정해 주세요."
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
  description: {
    fontSize: 15,
    lineHeight: "20px",
    whiteSpace: "pre-line",
    color: "var(--color-light-text-neutral-stronger)"
  },
  inputWrapper: {
    width: "100%",
    textAlign: "left"
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

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, auth, messagesPerField, message } = kcContext;
  const [userId, setUserId] = useState(auth.attemptedUsername ?? "");

  const hasUsernameError = messagesPerField.existsError("username");
  const usernameErrorText = hasUsernameError ? messagesPerField.getFirstError("username").trim() : "";
  const usernameError = usernameErrorText ? kcSanitize(usernameErrorText) : undefined;
  const systemMessage = hasUsernameError ? undefined : message;

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleClearUserId = () => {
    setUserId("");
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
            <LoginHeader title={PAGE_CONFIG.title} description={PAGE_CONFIG.description} />
            <SystemErrorAlert message={systemMessage} />

            <form id="kc-reset-password-form" action={url.loginAction} method="post">
              <div className="flex w-full flex-col items-center gap-4 text-center" style={styles.formContent}>
                <div
                  style={{
                    ...styles.iconBox,
                    backgroundColor: hasUsernameError ? "var(--color-light-graphic-red-weakest)" : "var(--color-light-graphic-primary-weakest)"
                  }}
                >
                  <IconProfile
                    size={32}
                    color={hasUsernameError ? "var(--color-light-icon-attention-strong)" : "var(--color-light-icon-brand-strong-01)"}
                  />
                </div>

                <p className="text-[15px] leading-5 whitespace-pre-line text-(--color-light-text-neutral-stronger)" style={styles.description}>
                  비밀번호를 재설정하기 위해
                  <br />
                  가입시 등록한 이메일 ID를 입력해 주세요.
                </p>

                <div className="w-full text-left" style={styles.inputWrapper}>
                  <TextField
                    id="username"
                    name="username"
                    placeholder="이메일 ID를 입력해 주세요."
                    value={userId}
                    onChange={handleUserIdChange}
                    autoFocus
                    autoComplete="username"
                    hdsProps={{
                      clearable: true,
                      size: "xlarge",
                      helpText: usernameError
                    }}
                    onClear={handleClearUserId}
                    error={hasUsernameError}
                  />
                </div>

                <div className="mt-8 flex w-full items-center justify-end gap-2" style={styles.buttonRow}>
                  <Button disabled={!userId.trim()} type="submit" size="xlarge" semantic="brand" styleOption="fill">
                    메일 보내기
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
