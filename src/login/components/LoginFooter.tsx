import { Divider, Link } from "@hae-fe/elements";
import type { CSSProperties } from "react";

type LoginPageType = "login";

interface FooterLink {
  label: string;
  href: string;
  visible?: (type: LoginPageType) => boolean;
}

const FOOTER_STYLES: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  flexCenter: {
    display: "flex",
    alignItems: "center"
  },
  link: {
    color: "var(--color-light-link-subtitle)"
  },
  divider: {
    height: 12,
    margin: "0 12px",
    backgroundColor: "var(--color-light-divider-neutral-weaker)"
  }
};

const LoginFooter = ({
  type,
  registrationUrl
}: {
  type: LoginPageType;
  registrationUrl: string;
}) => {
  const footerLinks: FooterLink[] = [
    {
      label: "회원가입",
      href: registrationUrl,
      visible: pageType => pageType === "login"
    }
  ];
  const visibleLinks = footerLinks.filter(link => link.visible?.(type) ?? true);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <div style={FOOTER_STYLES.container}>
      <div style={FOOTER_STYLES.flexCenter}>
        {visibleLinks.map((link, i) => (
          <div key={link.href} style={FOOTER_STYLES.flexCenter}>
            <Link size="medium" href={link.href} style={FOOTER_STYLES.link}>
              {link.label}
            </Link>
            {i < visibleLinks.length - 1 && (
              <Divider orientation="vertical" style={FOOTER_STYLES.divider} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginFooter;
