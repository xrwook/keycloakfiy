import { Button, Typography } from "@hae-fe/elements";
import { Icon3dTask } from "@hae-fe/icon-library/react/3d";
import { useEffect, useState, type CSSProperties } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const RESEND_REQUESTED_STORAGE_KEY = "login-verify-email-resend-requested";

const styles: Record<string, CSSProperties> = {
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "var(--color-light-alpha-black-60, rgba(0, 0, 0, 0.6))"
  },
  modal: {
    width: "min(100%, 420px)",
    padding: 28,
    borderRadius: "var(--radius-8)",
    backgroundColor: "var(--color-light-surface-white)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
    textAlign: "center"
  },
  modalTitle: {
    margin: 0,
    fontSize: "var(--typo-font-size-21)",
    fontWeight: 700,
    lineHeight: "var(--typo-line-height-30)",
    color: "var(--color-light-text-neutral-strongest)"
  },
  modalDescription: {
    margin: "12px 0 24px",
    fontSize: "var(--typo-font-size-15)",
    lineHeight: "var(--typo-line-height-22)",
    color: "var(--color-light-text-neutral-strong)"
  }
};

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, isAppInitiatedAction, message } = kcContext;
  const loginRestartUrl = url.loginRestartFlowUrl;
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);

  useEffect(() => {
    let resendRequested = false;

    try {
      resendRequested = sessionStorage.getItem(RESEND_REQUESTED_STORAGE_KEY) === "true";
    } catch {
      return;
    }

    // 재발송 요청 후 명시적인 오류가 없으면 재발송 완료로 처리한다.
    // Keycloak 설정에 따라 성공 응답의 message가 없거나 warning으로 내려올 수 있다.
    if (!resendRequested) {
      return;
    }

    if (message?.type === "error") {
      sessionStorage.removeItem(RESEND_REQUESTED_STORAGE_KEY);
      return;
    }

    sessionStorage.removeItem(RESEND_REQUESTED_STORAGE_KEY);
    setIsResendModalOpen(true);
  }, [message?.type]);

  const markResendRequested = () => {
    try {
      sessionStorage.setItem(RESEND_REQUESTED_STORAGE_KEY, "true");
    } catch {
      // Continue with the Keycloak request even when browser storage is unavailable.
    }
  };

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <Icon3dTask style={{ width: "160px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              본인 인증 확인 메일을 발송했습니다.
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              메일에서 인증을 완료하면 회원가입이 완료되며
              <br />
              관리자 승인 후 E-CMP를 이용할 수 있습니다.
            </Typography>
            <Button
              className="mt-6"
              size="large"
              semantic="neutral"
              styleOption="outline"
              onClick={() => {
                window.location.href = loginRestartUrl;
              }}
            >
              로그인 화면으로 이동
            </Button>
            {isAppInitiatedAction ? (
              <form id="kc-verify-email-form" action={url.loginAction} method="post" onSubmit={() => markResendRequested()}>
                <Button className="mt-6" size="large" semantic="brand" styleOption="fill" type="submit">
                  인증메일 재발송
                </Button>
              </form>
            ) : (
              <Button
                size="large"
                semantic="brand"
                styleOption="fill"
                className="mt-6"
                onClick={() => {
                  markResendRequested();
                  window.location.href = url.loginAction;
                }}
              >
                인증메일 재발송
              </Button>
            )}
          </div>
        </div>
      </div>
      {isResendModalOpen && (
        <div style={styles.modalBackdrop} role="presentation">
          <div style={styles.modal} role="dialog" aria-modal="true" aria-labelledby="email-resend-modal-title">
            <h2 id="email-resend-modal-title" style={styles.modalTitle}>
              인증메일을 재발송했습니다.
            </h2>
            <p style={styles.modalDescription}>메일함을 확인해 주세요.</p>
            <Button size="medium" semantic="brand" styleOption="fill" type="button" onClick={() => setIsResendModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      )}
    </Template>
  );
}
