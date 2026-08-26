import { Button, Checkbox, Divider, Dropdown, type DropdownOption, Link, TextField } from "@hae-fe/elements";
import { FormField, FormFieldRow } from "@hae-fe/pattern";
import axios from "axios";
import { useEffect, useState, type ChangeEvent, type CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>;

interface Partner {
  partnerId: string;
  partnerName: string;
}

interface PartnersResponse {
  data?: Partner[];
}

const backofficeApiBaseUrl = import.meta.env.VITE_BACKOFFICE_API_BASE_URL?.replace(/\/$/, "") ?? "";

const REQUIRED_ERROR_MESSAGES = new Set([
  "필수 입력 항목입니다.",
  "Please specify this field.",
  "Please specify value.",
  "값을 지정하세요.",
  "이 필드를 지정하세요.",
  "이메일을 지정하세요.",
  "비밀번호를 지정하세요.",
  "사용자 이름을 지정하세요.",
  "이름을 지정하세요.",
  "전화번호를 지정하세요."
]);

const FORMAT_ERROR_MESSAGES = new Set([
  "입력 형식이 올바르지 않습니다.",
  "잘못된 이메일 주소입니다.",
  "잘못된 값입니다.",
  "Invalid value.",
  "Invalid value specified.",
  "Please match requested format."
]);

const REQUIRED_FIELD_ERROR_MESSAGES = {
  company: "회사를 선택해 주세요.",
  name: "이름을 입력해 주세요.",
  email: "이메일 ID를 입력해 주세요.",
  password: "비밀번호를 입력해 주세요.",
  passwordConfirm: "비밀번호 확인을 입력해 주세요.",
  phoneNumber: "휴대폰 번호를 입력해 주세요."
} as const;

const FORMAT_FIELD_ERROR_MESSAGES = {
  email: "올바른 형식의 이메일을 입력해 주세요.",
  password: "영문자 시작, 특수문자/대소문자/숫자 포함 8자 이상 입력해 주세요.",
  phoneNumber: "올바른 형식의 휴대폰 번호를 입력해 주세요."
} as const;

const styles: Record<string, CSSProperties> = {
  title: {
    font: "var(--typo-title-21-bold)",
    color: "var(--color-light-text-neutral-strongest)"
  },
  description: {
    font: "var(--typo-body-15-regular)",
    color: "var(--color-light-text-neutral-strong)",
    marginTop: 6
  },
  emailRow: {
    display: "flex",
    gap: 8
  }
};

function normalizeErrorMessage(message: string) {
  return message.replace(/<[^>]*>/g, "").trim();
}

function isFormatError(errorMessage: string) {
  return FORMAT_ERROR_MESSAGES.has(errorMessage) || errorMessage.startsWith("잘못된 비밀번호") || errorMessage.startsWith("Invalid password");
}

function getRegisterFieldError(errorMessage: string | undefined, options: { requiredMessage: string; formatMessage?: string }) {
  if (errorMessage === undefined) {
    return undefined;
  }

  const normalizedErrorMessage = normalizeErrorMessage(errorMessage);

  if (REQUIRED_ERROR_MESSAGES.has(normalizedErrorMessage)) {
    return options.requiredMessage;
  }

  if (options.formatMessage !== undefined && isFormatError(normalizedErrorMessage)) {
    return options.formatMessage;
  }

  return errorMessage;
}

export default function Register(props: RegisterProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, profile, messagesPerField, message, termsAcceptanceRequired } = kcContext;

  const getAttributeValue = (name: string) => profile.attributesByName[name]?.value ?? "";
  const initialCompanyValue = getAttributeValue("company");

  const getFieldError = (fieldName: string, ...otherFieldNames: string[]) => {
    if (!messagesPerField.existsError(fieldName, ...otherFieldNames)) {
      return undefined;
    }

    const errorMessage = messagesPerField.getFirstError(fieldName, ...otherFieldNames);

    return errorMessage?.trim() ? kcSanitize(errorMessage) : undefined;
  };

  const [name, setName] = useState(getAttributeValue("name"));
  const [companyOptions, setCompanyOptions] = useState<DropdownOption[]>([]);
  const [company, setCompany] = useState<DropdownOption | null>(null);
  const [email, setEmail] = useState(getAttributeValue("email"));
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(getAttributeValue("phoneNumber"));
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (backofficeApiBaseUrl === "") {
      return;
    }

    axios
      .get<PartnersResponse>(`${backofficeApiBaseUrl}/home/join/partners`, {
        headers: {
          Accept: "application/json;charset=UTF-8"
        }
      })
      .then((response: { data: PartnersResponse }) => {
        if (!mounted) {
          return;
        }

        const options: DropdownOption[] = (response.data.data ?? []).map(({ partnerId, partnerName }: Partner) => ({
          value: partnerId,
          label: partnerName
        }));

        setCompanyOptions(options);
        setCompany(
          (currentCompany: DropdownOption | null) =>
            currentCompany ?? options.find((option: DropdownOption) => option.value === initialCompanyValue) ?? null
        );
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setCompanyOptions([]);
      });

    return () => {
      mounted = false;
    };
  }, [initialCompanyValue]);

  const companyError = getRegisterFieldError(getFieldError("company"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.company
  });
  const nameError = getRegisterFieldError(getFieldError("name"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.name
  });
  const emailError = getRegisterFieldError(getFieldError("email", "username"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.email,
    formatMessage: FORMAT_FIELD_ERROR_MESSAGES.email
  });
  const passwordError = getRegisterFieldError(getFieldError("password"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.password,
    formatMessage: FORMAT_FIELD_ERROR_MESSAGES.password
  });
  const passwordConfirmError = getRegisterFieldError(getFieldError("password-confirm"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.passwordConfirm
  });
  const phoneNumberError = getRegisterFieldError(getFieldError("phoneNumber"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.phoneNumber,
    formatMessage: FORMAT_FIELD_ERROR_MESSAGES.phoneNumber
  });
  const systemMessage = messagesPerField.existsError("global") ? message : undefined;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} displayMessage={false} headerNode={null}>
      <div className="mx-auto flex h-dvh w-100 flex-col justify-center">
        <div className="flex flex-col gap-6">
          <div>
            <div>
              <div style={styles.title}>개인정보 입력</div>
              <div style={styles.description}>회원 가입을 위해 정보를 입력해 주세요.</div>
            </div>
          </div>

          {systemMessage !== undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: kcSanitize(systemMessage.summary)
              }}
            />
          )}

          <div>
            <form id="kc-register-form" action={url.registrationAction} method="post">
              <FormFieldRow cols={1}>
                <FormField
                  layout="vertical"
                  label="회사"
                  controller={
                    <>
                      <Dropdown
                        hdsProps={{ helpText: companyError ?? "" }}
                        placeholder="회사를 선택해 주세요."
                        options={companyOptions}
                        value={company}
                        onChange={(v: DropdownOption | null) => setCompany(v)}
                      />
                      <input type="hidden" name="company" value={company?.value ?? ""} />
                    </>
                  }
                />
                <FormField
                  layout="vertical"
                  label="이름"
                  controller={
                    <TextField
                      name="name"
                      hdsProps={{ helpText: nameError ?? "" }}
                      placeholder="이름을 입력해 주세요."
                      value={name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      error={nameError !== undefined}
                    />
                  }
                />
                <FormField
                  layout="vertical"
                  label="이메일 ID"
                  controller={
                    <div style={styles.emailRow}>
                      <TextField
                        name="email"
                        hdsProps={{ helpText: emailError ?? "올바른 형식의 이메일을 입력해 주세요." }}
                        placeholder="이메일 ID를 입력해 주세요."
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        error={emailError !== undefined}
                      />
                    </div>
                  }
                />
                <FormField
                  layout="vertical"
                  label="비밀번호"
                  controller={
                    <TextField
                      name="password"
                      hdsProps={{
                        helpText: passwordError ?? "영문자 시작, 특수문자/대소문자/숫자 포함 8자 이상 입력해 주세요."
                      }}
                      type="password"
                      placeholder="비밀번호를 입력해 주세요."
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      error={passwordError !== undefined}
                    />
                  }
                />
                <FormField
                  layout="vertical"
                  label="비밀번호 확인"
                  controller={
                    <TextField
                      name="password-confirm"
                      hdsProps={{ helpText: passwordConfirmError ?? "비밀번호가 일치하지 않습니다." }}
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={passwordConfirm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
                      error={passwordConfirmError !== undefined}
                    />
                  }
                />
                <FormField
                  layout="vertical"
                  label="휴대폰 번호"
                  controller={
                    <TextField
                      name="phoneNumber"
                      hdsProps={{ helpText: phoneNumberError ?? "올바른 형식의 휴대폰 번호를 입력해 주세요." }}
                      placeholder="휴대폰 번호 입력해 주세요."
                      value={phoneNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                      error={phoneNumberError !== undefined}
                    />
                  }
                />
              </FormFieldRow>
              {agreed && <input type="hidden" name="termsAccepted" value="on" />}
            </form>
          </div>

          <div>
            <div className="flex flex-col gap-2.5">
              <Link size="medium" href="#" icon>
                서비스 이용약관 상세보기(필수)
              </Link>
              <Link size="medium" href="#" icon>
                개인정보 처리방침 상세보기 (필수)
              </Link>
            </div>

            <div className="my-5">
              <Divider />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                label="위 약관을 모두 확인 했으며 이에 동의합니다."
                checked={agreed}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              semantic="brand"
              styleOption="fill"
              size="medium"
              type="submit"
              form="kc-register-form"
              disabled={termsAcceptanceRequired && !agreed}
            >
              가입하기
            </Button>
          </div>
        </div>
      </div>
    </Template>
  );
}
