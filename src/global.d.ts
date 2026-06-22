export {};

declare global {
  interface Window {
    onSubmitRecaptcha?: () => void;
  }
}
