import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Typography } from "@hae-fe/elements";
import { Icon3dTask } from "../assets";
import { ConfirmModal } from "../components/ConfirmModal";
import SystemErrorAlert from "../components/SystemErrorAlert";
import { useEffect, useState } from "react";
import { RESEND_REQUEST_KEY, RESEND_REQUEST_MS, clearResendRequested } from "../emailResendRequest";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, isAppInitiatedAction, message, user } = kcContext;
  const loginUrl = url.loginRestartFlowUrl;
  const loginAction = url.loginAction;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    let requestedAt: number;
    try {
      const storedRequestTime = sessionStorage.getItem(RESEND_REQUEST_KEY);
      requestedAt = storedRequestTime === null ? NaN : Number(storedRequestTime);
      // Consume once, including expired requests and failed responses.
      sessionStorage.removeItem(RESEND_REQUEST_KEY);
    } catch {
      return;
    }

    const age = Date.now() - requestedAt;
    if (!Number.isFinite(requestedAt) || requestedAt <= 0 || age < 0 || age > RESEND_REQUEST_MS) {
      return;
    }
    if (message?.type === "error") {
      return;
    }

    // The internal page returns warning after resending too.
    // Returning from the request does not itself prove mail delivery.
    const email = user?.email;
    setResendMessage(email ? `${email}로 인증 메일을 재발송했습니다.` : "인증 메일을 재발송했습니다.");
    setIsModalOpen(true);
  }, [message?.type, user?.email]);

  const markResendRequest = () => {
    try {
      sessionStorage.setItem(RESEND_REQUEST_KEY, String(Date.now()));
    } catch {
      // Continue with the request even if storage is unavailable.
    }
  };

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <img src={Icon3dTask} alt="" style={{ width: "160px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              본인 인증 확인 메일을 발송했습니다.
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              메일에서 인증을 완료하면 회원가입이 완료되며
              <br />
              관리자 승인 후 E-CMP를 이용할 수 있습니다.
            </Typography>
            {message?.type === "error" && <SystemErrorAlert message={message} />}
            <div>
              <Button
                className="mt-6"
                size="large"
                semantic="neutral"
                styleOption="outline"
                type="button"
                onClick={() => {
                  clearResendRequested();
                  window.location.href = loginUrl;
                }}
              >
                로그인 화면으로 이동
              </Button>
              {isAppInitiatedAction ? (
                <form id="kc-verify-email-form" action={loginAction} method="post" onSubmit={markResendRequest}>
                  <Button className="mt-2" size="large" semantic="neutral" styleOption="outline" type="submit">
                    인증 메일 재발송
                  </Button>
                </form>
              ) : (
                <Button
                  className="mt-2 ml-2"
                  size="large"
                  semantic="neutral"
                  styleOption="outline"
                  type="button"
                  onClick={() => {
                    markResendRequest();
                    window.location.href = loginAction;
                  }}
                >
                  인증 메일 재발송
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmModal message={resendMessage} title="인증 메일 재발송 완료" onClose={() => setIsModalOpen(false)} />
      )}
    </Template>
  );
}
