import { Button, Typography } from "@hae-fe/elements";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Icon3dTask } from "../assets";
import SystemErrorAlert from "../components/SystemErrorAlert";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, idpAlias, message } = kcContext;

  const { msg } = i18n;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <img src={Icon3dTask} alt="" style={{ width: "160px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              이미 가입된 계정이 있습니다.
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              기존 계정에 SSO 로그인을 연동하려면 계정 인증이 필요하며
              <br />
              인증 완료 후 일반 로그인과 SSO 로그인을 모두 이용할 수 있습니다.
            </Typography>
            {message?.type === "error" && <SystemErrorAlert message={message} />}
            <form id="kc-register-form" action={url.loginAction} method="post" className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                size="large"
                semantic="neutral"
                styleOption="outline"
                type="submit"
                name="submitAction"
                id="updateProfile"
                value="updateProfile"
              >
                {msg("confirmLinkIdpReviewProfile")}
              </Button>
              <Button
                size="large"
                semantic="neutral"
                styleOption="outline"
                type="submit"
                name="submitAction"
                id="linkAccount"
                value="linkAccount"
              >
                {msg("confirmLinkIdpContinue", idpAlias)}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
