import { useState, type ChangeEvent, type CSSProperties } from "react";
import { Button, Checkbox, Divider, Link, TextField } from "@hae-fe/elements";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import LoginFooter from "../components/LoginFooter";
import LoginHeader from "../components/LoginHeader";
import SystemErrorAlert, { type SystemErrorType } from "../components/SystemErrorAlert";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type LoginPageType = "login";

interface PageConfig {
  title: string;
  description: string;
}

const PAGE_CONFIG: Record<LoginPageType, PageConfig> = {
  login: {
    title: "로그인",
    description: "로그인 정보를 입력해 주세요."
  }
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

const getSystemError = (message: Extract<KcContext, { pageId: "login.ftl" }>["message"] | undefined): SystemErrorType | null => {
  if (message === undefined) {
    return null;
  }

  if (message.type === "success") {
    return "resetSuccess";
  }

  if (message.type === "info") {
    return "resetEmailSent";
  }

  return "loginFailed";
};

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, message } = kcContext;

  const { title, description } = PAGE_CONFIG.login;
  const [userId, setUserId] = useState(login.username ?? "");
  const [password, setPassword] = useState("");
  const [rememberUserId, setRememberUserId] = useState(!!login.rememberMe);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const hasCredentialError = messagesPerField.existsError("username", "password");
  const errorMessage = hasCredentialError ? "사번 또는 비밀번호가 일치하지 않습니다." : undefined;
  const systemError = hasCredentialError ? null : getSystemError(message);
  const socialProviders = realm.password && social?.providers !== undefined ? social.providers : [];
  const isSubmitDisabled = isLoginButtonDisabled || (!usernameHidden && userId.trim() === "") || password.trim() === "";

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClearUserId = () => {
    setUserId("");
  };

  const handleClearPassword = () => {
    setPassword("");
  };

  const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberUserId(event.target.checked);
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
            <LoginHeader title={title} userId={usernameHidden ? auth.attemptedUsername : undefined} description={description} />

            <div>
              {realm.password && (
                <form
                  id="kc-form-login"
                  action={url.loginAction}
                  method="post"
                  onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                  }}
                >
                  <div className="flex flex-col gap-2.5" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <SystemErrorAlert systemError={systemError} />

                    {!usernameHidden && (
                      <TextField
                        id="username"
                        name="username"
                        placeholder="이메일 ID를 입력해 주세요."
                        value={userId}
                        onChange={handleUserIdChange}
                        error={hasCredentialError}
                        autoFocus
                        autoComplete="username"
                        hdsProps={{ clearable: true, size: "xlarge" }}
                        onClear={handleClearUserId}
                      />
                    )}
                    <TextField
                      id="password"
                      name="password"
                      placeholder="비밀번호를 입력해 주세요."
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      error={hasCredentialError}
                      autoComplete="current-password"
                      hdsProps={{
                        clearable: true,
                        size: "xlarge",
                        helpText: errorMessage
                      }}
                      onClear={handleClearPassword}
                    />
                  </div>

                  <div
                    className="mt-2.5 flex items-center justify-between"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}
                  >
                    <div id="kc-form-options">
                      {realm.rememberMe && !usernameHidden && (
                        <>
                          {rememberUserId && <input type="hidden" name="rememberMe" value="on" />}
                          <Checkbox label="아이디 저장" checked={rememberUserId} onChange={handleRememberChange} />
                        </>
                      )}
                    </div>
                    {realm.resetPasswordAllowed && (
                      <Link size="medium" href={url.loginResetCredentialsUrl}>
                        비밀번호를 잊으셨나요?
                      </Link>
                    )}
                  </div>

                  <div id="kc-form-buttons" className="mt-12" style={{ marginTop: 48 }}>
                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                    <Button
                      disabled={isSubmitDisabled}
                      type="submit"
                      name="login"
                      id="kc-login"
                      value="로그인"
                      size="xlarge"
                      semantic="brand"
                      styleOption="fill"
                      style={{ width: "100%" }}
                    >
                      로그인
                    </Button>
                    {socialProviders.length > 0 && (
                      <>
                        <Divider className="my-2.5" style={{ margin: "10px 0" }}>
                          또는
                        </Divider>
                        {socialProviders.map(provider => (
                          <Button
                            key={provider.alias}
                            id={`social-${provider.alias}`}
                            type="button"
                            size="xlarge"
                            semantic="brand"
                            styleOption="outline"
                            className="w-full"
                            style={{ width: "100%" }}
                            onClick={() => {
                              window.location.href = provider.loginUrl;
                            }}
                          >
                            {provider.displayName}
                          </Button>
                        ))}
                      </>
                    )}
                  </div>
                </form>
              )}
            </div>

            {realm.password && realm.registrationAllowed && !registrationDisabled && (
              <LoginFooter type="login" registrationUrl={url.registrationUrl} />
            )}
          </div>
        </div>
      </div>
    </Template>
  );
}
