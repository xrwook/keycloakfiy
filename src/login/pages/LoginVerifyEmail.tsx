import { Button, Typography } from "@hae-fe/elements";
import { Icon3dTask } from "@hae-fe/icon-library/react/3d";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url } = kcContext;
  const loginUrl = url.loginUrl;

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
                window.location.href = loginUrl;
              }}
            >
              로그인 화면으로 이동
            </Button>
          </div>
        </div>
      </div>
    </Template>
  );
}
