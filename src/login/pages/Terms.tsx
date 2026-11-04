import { Button, Checkbox, Divider, Link, Typography } from "@hae-fe/elements";
import { useState, type ChangeEvent, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useModal } from "@/shared/lib/modal";
import { TermsModal } from "@/shared/ui/termsViewer";
import Logo from "../assets/images/login-logo.svg";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

const styles: Record<string, CSSProperties> = {
  loginWrapper: {
    width: 480,
    margin: "auto",
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
  container: {
    display: "flex",
    flexDirection: "column"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  title: {
    marginTop: 24,
    fontSize: "var(--typo-font-size-37)",
    fontWeight: "bold",
    lineHeight: "var(--typo-line-height-54)",
    letterSpacing: "var(--typo-letter-spacing-headline-37)",
    color: "var(--color-light-text-neutral-strongest)"
  },
  description: {
    marginTop: 12,
    fontSize: "var(--typo-font-size-17)",
    lineHeight: "var(--typo-line-height-24)",
    color: "var(--color-light-text-neutral-stronger)",
    whiteSpace: "pre-line"
  }
};

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url } = kcContext;
  const { msgStr } = i18n;
  const [checked, setChecked] = useState(false);
  const { open } = useModal();

  const handleTermClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    open<void>(TermsModal, {
      title: msgStr("termsTitle"),
      content: msgStr("termsText")
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!checked) {
      event.preventDefault();
    }
  };

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div
        className="flex h-dvh"
        style={{
          backgroundColor: "var(--color-light-background-neutral-weakest)"
        }}
      >
        <div style={styles.loginWrapper}>
          <div style={styles.loginContainer}>
            <div style={styles.container}>
              <div style={styles.logo}>
                <img src={Logo} alt="현대엔지니어링" />
                <Divider orientation="vertical" className="my-0.5 h-5 items-center" />
                <Typography hdsProps={{ weight: "bold", type: "body", size: "17" }}>E-CMP</Typography>
              </div>

              <div style={styles.title}>약관 재동의</div>
              <p style={styles.description}>{"필수 약관이 업데이트되었습니다. \n 계속 이용하려면 변경된 약관을 확인하고 동의해 주세요."}</p>
            </div>
            <form id="kc-terms-form" action={url.loginAction} method="post" onSubmit={handleSubmit} className="relative flex w-full flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <Link size="medium" icon onClick={handleTermClick}>
                  {msgStr("termsTitle")}(필수)
                </Link>
              </div>
              <Divider />
              <Checkbox
                size="medium"
                label="변경된 약관을 모두 확인하고 동의합니다."
                checked={checked}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setChecked(event.target.checked)}
              />
              <div className="mt-8 flex w-full items-center justify-end gap-2">
                <Button disabled={!checked} type="submit" name="accept" id="kc-accept" value="true" size="medium" semantic="brand" styleOption="fill">
                  확인
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
