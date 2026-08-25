import { Button, TextField } from "@hae-fe/elements";
import { useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";

interface TotpAuthFormProps {
  action: string;
  qrCodeSrc?: string;
  secret?: string;
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
  secretField: {
    margin: "0 auto",
    width: 200,
    textAlign: "center"
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
  }
};

const TotpAuthForm = ({
  action,
  qrCodeSrc,
  secret,
  errorMessage,
  children
}: TotpAuthFormProps) => {
  const [otpValue, setOtpValue] = useState("");
  const normalizedErrorMessage = errorMessage?.trim() ? errorMessage : undefined;
  const showError = normalizedErrorMessage !== undefined;

  const handleOtpValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOtpValue(event.target.value);
  };

  const handleClearOtpValue = () => {
    setOtpValue("");
  };

  return (
    <form id="kc-totp-settings-form" action={action} method="post">
      {children}
      <div className="w-full text-center" style={styles.fullCenter}>
        <div className="flex w-full flex-col items-center gap-4" style={styles.column}>
          <div>
            {qrCodeSrc !== undefined && (
              <img src={qrCodeSrc} width={140} alt="QRCODE 이미지" />
            )}
          </div>
          <TextField
            readOnly
            placeholder="ABCDEFGHIJKLMNOP"
            value={secret ?? ""}
            className="mx-auto w-50 text-center"
            style={styles.secretField}
            hdsProps={{
              size: "medium"
            }}
          />
          <p
            className="text-[15px] leading-5 whitespace-pre-line text-(--color-light-text-neutral-stronger)"
            style={styles.description}
          >
            {"Google OTP 앱에 표시된 \n 인증번호 6자리를 입력해 주세요."}
          </p>
          <div className="flex w-full gap-2" style={styles.inputRow}>
            <TextField
              id="totp"
              name="totp"
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
            />
            <Button
              id="saveTOTPBtn"
              type="submit"
              size="xlarge"
              semantic="brand"
              styleOption="fill"
            >
              등록
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TotpAuthForm;
