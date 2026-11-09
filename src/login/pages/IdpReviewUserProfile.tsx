import { Button, Dropdown, type DropdownOption, TextField } from "@hae-fe/elements";
import { FormField, FormFieldRow } from "@hae-fe/pattern";
import axios from "axios";
import { useEffect, useState, type ChangeEvent, type CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import SystemErrorAlert from "../components/SystemErrorAlert";

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n>;

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
  "이름을 지정하세요.",
  "전화번호를 지정하세요."
]);

const FORMAT_ERROR_MESSAGES = new Set([
  "입력 형식이 올바르지 않습니다.",
  "잘못된 값입니다.",
  "Invalid value.",
  "Invalid value specified.",
  "Please match requested format."
]);

const REQUIRED_FIELD_ERROR_MESSAGES = {
  company: "회사를 선택해 주세요.",
  name: "이름을 입력해 주세요.",
  phoneNumber: "휴대폰 번호를 입력해 주세요."
} as const;

const FORMAT_FIELD_ERROR_MESSAGES = {
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
  }
};

function normalizeErrorMessage(message: string) {
  return message.replace(/<[^>]*>/g, "").trim();
}

function isFormatError(errorMessage: string) {
  return FORMAT_ERROR_MESSAGES.has(errorMessage) || errorMessage.startsWith("Invalid phone number");
}

function getFieldError(errorMessage: string | undefined, options: { requiredMessage: string; formatMessage?: string }) {
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

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, profile, messagesPerField, message } = kcContext;

  const getAttributeValue = (name: string) => profile.attributesByName[name]?.value ?? "";
  const initialCompanyValue = getAttributeValue("company");

  const [name, setName] = useState(getAttributeValue("name"));
  const [companyOptions, setCompanyOptions] = useState<DropdownOption[]>([]);
  const [company, setCompany] = useState<DropdownOption | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(getAttributeValue("phoneNumber"));
  const [dismissedFieldErrors, setDismissedFieldErrors] = useState<Set<string>>(new Set());

  const clearFieldError = (...fieldNames: string[]) => {
    setDismissedFieldErrors(currentFields => {
      const nextFields = new Set(currentFields);

      fieldNames.forEach(fieldName => nextFields.add(fieldName));

      return nextFields;
    });
  };

  const getFormFieldError = (fieldName: string) => {
    if (dismissedFieldErrors.has(fieldName) || !messagesPerField.existsError(fieldName)) {
      return undefined;
    }

    const errorMessage = messagesPerField.getFirstError(fieldName);

    return errorMessage?.trim() ? kcSanitize(errorMessage) : undefined;
  };

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
        setCompany((currentCompany: DropdownOption | null) => currentCompany ?? options.find(option => option.value === initialCompanyValue) ?? null);
      })
      .catch(() => {
        if (mounted) {
          setCompanyOptions([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [initialCompanyValue]);

  const companyError = getFieldError(getFormFieldError("company"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.company
  });
  const nameError = getFieldError(getFormFieldError("name"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.name
  });
  const phoneNumberError = getFieldError(getFormFieldError("phoneNumber"), {
    requiredMessage: REQUIRED_FIELD_ERROR_MESSAGES.phoneNumber,
    formatMessage: FORMAT_FIELD_ERROR_MESSAGES.phoneNumber
  });
  const systemMessage = messagesPerField.existsError("global") && message !== undefined ? { ...message, type: "warning" as const } : undefined;

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

          <SystemErrorAlert message={systemMessage} />

          <div>
            <form id="kc-idp-review-profile-form" action={url.loginAction} method="post">
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
                        onChange={(value: DropdownOption | null) => {
                          clearFieldError("company");
                          setCompany(value);
                        }}
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
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        clearFieldError("name");
                        setName(event.target.value);
                      }}
                      error={nameError !== undefined}
                    />
                  }
                />
                <FormField
                  layout="vertical"
                  label="휴대폰 번호"
                  controller={
                    <TextField
                      name="phoneNumber"
                      hdsProps={{ helpText: phoneNumberError ?? "" }}
                      placeholder="휴대폰 번호를 입력해 주세요."
                      value={phoneNumber}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        clearFieldError("phoneNumber");
                        setPhoneNumber(event.target.value);
                      }}
                      error={phoneNumberError !== undefined}
                    />
                  }
                />
              </FormFieldRow>
            </form>
          </div>

          <div className="flex justify-end gap-2">
            <Button semantic="brand" styleOption="fill" size="medium" type="submit" form="kc-idp-review-profile-form">
              확인
            </Button>
          </div>
        </div>
      </div>
    </Template>
  );
}
