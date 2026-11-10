import { Suspense, lazy, useEffect } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import { clearResendRequested } from "./emailResendRequest";
const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));

const Register = lazy(() => import("./pages/Register"));
const Error = lazy(() => import("./pages/Error"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));
const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));
const Info = lazy(() => import("./pages/Info"));
const LoginResetOtp = lazy(() => import("./pages/LoginResetOtp"));
const Terms = lazy(() => import("./pages/Terms"));
const IdpReviewUserProfile = lazy(() => import("./pages/IdpReviewUserProfile"));
const LoginIdpLinkConfirm = lazy(() => import("./pages/LoginIdpLinkConfirm"));
const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const Login = lazy(() => import("./pages/Login"));
  const { i18n } = useI18n({ kcContext });

  useEffect(() => {
    if (kcContext.pageId !== "login-verify-email.ftl") {
      clearResendRequested();
    }
  }, [kcContext.pageId]);

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "info.ftl":
            return (
              <Info
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-verify-email.ftl":
            return (
              <LoginVerifyEmail
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-update-password.ftl":
            return (
              <LoginUpdatePassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-reset-password.ftl":
            return (
              <LoginResetPassword
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-otp.ftl":
            return (
              <LoginOtp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-config-totp.ftl":
            return (
              <LoginConfigTotp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "terms.ftl":
            return (
              <Terms
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-idp-link-confirm.ftl":
            return (
              <LoginIdpLinkConfirm
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "idp-review-user-profile.ftl":
            return (
              <IdpReviewUserProfile
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login-reset-otp.ftl":
            return (
              <LoginResetOtp
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "error.ftl":
            return (
              <Error
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "login.ftl":
            return (
              <Login
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          case "register.ftl":
            return (
              <Register
                {...{ kcContext, i18n, classes }}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              />
            );
        }
      })()}
    </Suspense>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };
