import { Button, Link, TextField } from "@hae-fe/elements";
import { IconLock } from "@hae-fe/icon-library/react";
import { useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";

interface OtpAuthFormProps {
  action: string;
  errorMessage?: string;
  children?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  fullCenter: {
    width: "100%",
    textAlign: "center"
  },
  column: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 16
  },
  description: {
    fontSize: 15,
    lineHeight: "20px",
    whiteSpace: "pre-line",
    color: "var(--color-light-text-neutral-stronger)"
  },
  inputRow: {
    display: "flex",
    width: "100%",
    gap: 8
  },
  input: {
    flex: 1
  },
  bottom: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 48
  },
  resetLink: {
    color: "var(--color-light-link-default)"
  }
};

const OtpAuthForm = ({ action, errorMessage, children }: OtpAuthFormProps) => {
  const [otpValue, setOtpValue] = useState("");
  const normalizedErrorMessage = errorMessage?.trim() ? errorMessage : undefined;
  const showError = normalizedErrorMessage !== undefined;

  const handleOtpValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOtpValue(event.target.value);
  };

  const handleClearOtpValue = () => {
    setOtpValue("");
  };

  const handleOtpResetClick = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    document.getElementById("kc-otp-reset-button")?.click();
  };

  return (
    <form id="kc-otp-login-form" action={action} method="post">
      {children}
      <div className="w-full text-center" style={styles.fullCenter}>
        <div className="flex w-full flex-col items-center gap-4" style={styles.column}>
          <div
            style={{
              backgroundColor: showError
                ? "var(--color-light-graphic-red-weakest)"
                : "var(--color-light-graphic-primary-weakest)",
              borderRadius: "var(--radius-4)",
              padding: 12
            }}
          >
            <IconLock
              size={32}
              color={
                showError
                  ? "var(--color-light-icon-attention-strong)"
                  : "var(--color-light-icon-brand-strong-01)"
              }
            />
          </div>
          <p
            className="text-[15px] leading-5 whitespace-pre-line text-(--color-light-text-neutral-stronger)"
            style={styles.description}
          >
            {"Google OTP 앱에 표시된 \n 인증번호 6자리를 입력해 주세요."}
          </p>
          <div className="flex w-full gap-2" style={styles.inputRow}>
            <TextField
              id="otp"
              name="otp"
              placeholder="인증번호를 입력해 주세요."
              value={otpValue}
              onChange={handleOtpValueChange}
              hdsProps={{
                clearable: true,
                size: "xlarge",
                helpText: normalizedErrorMessage
              }}
              onClear={handleClearOtpValue}
              error={showError}
              className="flex-1"
              style={styles.input}
              autoComplete="off"
              autoFocus
            />
            <Button
              name="login"
              id="kc-login"
              type="submit"
              size="xlarge"
              semantic="brand"
              styleOption="fill"
            >
              확인
            </Button>
          </div>

          <div
            className="mt-12 flex w-full items-center justify-between"
            style={styles.bottom}
          >
            <p
              className="text-[15px] leading-5 text-(--color-light-text-neutral-stronger)"
              style={styles.description}
            >
              OTP 인증이 어려우신가요?
            </p>
            <Link
              size="medium"
              href="#"
              onClick={handleOtpResetClick}
              className="color-(--color-light-link-default)"
              style={styles.resetLink}
            >
              OTP 재설정하기
            </Link>
            <button
              id="kc-otp-reset-button"
              name="reset-otp"
              value="true"
              type="submit"
              formNoValidate
              style={{ display: "none" }}
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default OtpAuthForm;
