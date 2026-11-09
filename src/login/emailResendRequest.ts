export const RESEND_REQUEST_KEY = "login-verify-email-resend-request";
export const RESEND_REQUEST_MS = 30 * 1000;

export function clearResendRequested() {
  try {
    sessionStorage.removeItem(RESEND_REQUEST_KEY);
  } catch {
    // Storage may be unavailable; navigation should still work.
  }
}
