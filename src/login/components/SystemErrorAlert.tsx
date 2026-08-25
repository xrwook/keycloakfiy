import { Alert } from "@hae-fe/elements";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

export type SystemErrorType =
  | "loginFailed"
  | "resetEmailSent"
  | "resetLinkExpired"
  | "resetOTPSent"
  | "resetSuccess";

interface SystemErrorConfig {
  alertType: "attention" | "information" | "success";
  lines: string[];
}

interface SystemMessage {
  type: "success" | "warning" | "error" | "info";
  summary: string;
}

interface SystemErrorAlertProps {
  systemError?: SystemErrorType | null;
  message?: SystemMessage;
}

const SYSTEM_ERROR_CONFIG: Record<SystemErrorType, SystemErrorConfig> = {
  loginFailed: {
    alertType: "attention",
    lines: ["로그인 처리 중 오류가 발생했습니다.", "나중에 다시 시도해 주세요."]
  },
  resetEmailSent: {
    alertType: "information",
    lines: ["비밀번호 재설정 메일을 발송했습니다.", "메일을 확인해 주세요."]
  },
  resetSuccess: {
    alertType: "success",
    lines: ["비밀번호 재설정이 완료되었습니다."]
  },
  resetLinkExpired: {
    alertType: "attention",
    lines: ["비밀번호 재설정 링크가 만료되었습니다.", "다시 요청해 주세요."]
  },
  resetOTPSent: {
    alertType: "success",
    lines: [
      "OTP 재설정 메일을 발송했습니다..",
      "메일 링크를 통해 비밀번호 재설정 후 OTP를 설정해 주세요."
    ]
  }
};

const getAlertType = (
  messageType: SystemMessage["type"]
): SystemErrorConfig["alertType"] => {
  if (messageType === "success") {
    return "success";
  }

  if (messageType === "info") {
    return "information";
  }

  return "attention";
};

const SystemErrorAlert = ({ systemError = null, message }: SystemErrorAlertProps) => {
  if (message !== undefined) {
    return (
      <Alert hdsProps={{ type: getAlertType(message.type) }}>
        <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
      </Alert>
    );
  }

  if (systemError === null) {
    return null;
  }

  const { alertType, lines } = SYSTEM_ERROR_CONFIG[systemError];

  return (
    <Alert hdsProps={{ type: alertType }}>
      <span>
        {lines.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
    </Alert>
  );
};

export default SystemErrorAlert;
