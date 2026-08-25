import { Divider, Typography } from "@hae-fe/elements";
import { IconProfile } from "@hae-fe/icon-library/react";
import type { CSSProperties, ReactNode } from "react";
import LoginLogo from "../assets/images/login-logo.svg";

interface LoginHeaderProps {
  title?: ReactNode;
  userId?: string;
  description?: ReactNode;
}

const HEAD_STYLES: Record<string, CSSProperties> = {
  logo: {
    display: "flex",
    gap: 12,
    alignItems: "center"
  },
  container: {
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: "var(--typo-font-size-37)",
    fontWeight: "bold",
    lineHeight: "var(--typo-line-height-54)",
    letterSpacing: "var(--typo-letter-spacing-headline-37)",
    color: "var(--color-light-text-neutral-strongest)",
    marginTop: 24
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: "var(--typo-font-size-17)",
    fontWeight: "bold",
    lineHeight: "var(--typo-line-height-24)",
    color: "var(--color-light-text-neutral-strongest)",
    marginTop: 12
  },
  description: {
    fontSize: "var(--typo-font-size-17)",
    lineHeight: "var(--typo-line-height-24)",
    color: "var(--color-light-text-neutral-stronger)",
    marginTop: 12,
    whiteSpace: "pre-line"
  }
};

const LoginHeader = ({ title, userId, description }: LoginHeaderProps) => {
  return (
    <div style={HEAD_STYLES.container}>
      <div style={HEAD_STYLES.logo}>
        <img src={LoginLogo} alt="현대엔지니어링" />
        <Divider
          orientation="vertical"
          className="my-0.5 h-5 items-center"
          style={{ margin: "2px 0", height: 20, alignItems: "center" }}
        />
        <Typography hdsProps={{ weight: "bold", type: "body", size: "17" }}>
          E-CMP
        </Typography>
      </div>

      <div style={HEAD_STYLES.title}>{title}</div>
      {userId && (
        <div style={HEAD_STYLES.userInfo}>
          <IconProfile size={20} type="outline" />
          <span>{userId}</span>
        </div>
      )}
      <p style={HEAD_STYLES.description}>{description}</p>
    </div>
  );
};

export default LoginHeader;
