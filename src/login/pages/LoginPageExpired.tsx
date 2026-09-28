import { Button, Typography } from "@hae-fe/elements";
import { Icon3dWarning } from "@hae-fe/icon-library/react/3d";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url } = kcContext;

  const loginUrl = url.loginUrl;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <Icon3dWarning style={{ width: "160px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              페이지가 만료되었습니다.
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              {"페이지가 만료되어 더 이상 진행할 수 없습니다.\n 로그인 화면에서 다시 진행해 주세요."}
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
