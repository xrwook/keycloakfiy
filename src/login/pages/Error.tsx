import { Button, Typography } from "@hae-fe/elements";
import { Icon3dPageNotFound } from "@hae-fe/icon-library/react/3d";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { client, url } = kcContext;
  const loginUrl = url.loginUrl ?? client?.baseUrl ?? "#";

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col items-center gap-5">
          <Icon3dPageNotFound style={{ width: "240px" }} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <p className="text-center text-[25px] leading-9 font-bold whitespace-pre-line text-(--color-text-neutral-strongest)">
              화면을 불러오지 못했습니다.
            </p>
            <Typography hdsProps={{ size: "17", type: "body" }} className="text-center whitespace-pre-line text-(--color-text-neutral-stronger)">
              페이지를 찾을 수 없거나 일시적인 오류가 발생했어요.
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
