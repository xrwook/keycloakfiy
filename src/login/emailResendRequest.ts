export const RESEND_REQUEST_KEY = "login-verify-email-resend-request";

export function clearResendRequested() {
  try {
    sessionStorage.removeItem(RESEND_REQUEST_KEY);
  } catch {
    // Storage may be unavailable; navigation should still work.
  }
}
