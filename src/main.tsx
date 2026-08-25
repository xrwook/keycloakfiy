import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: "login.ftl",
    overrides: {
      social: {
        displayInfo: true,
        providers: [
          {
            loginUrl: "#",
            alias: "hyundai-engineering",
            providerId: "oidc",
            displayName: "현대엔지니어링 SSO 로그인"
          }
        ]
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {!window.kcContext ? (
      <h1>No Keycloak Context</h1>
    ) : (
      <KcPage kcContext={window.kcContext} />
    )}
  </StrictMode>
);
