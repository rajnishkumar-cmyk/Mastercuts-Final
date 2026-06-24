/**
 * Deprecated: login is now email-primary (see EmailLoginStep). This file is
 * kept only as a thin re-export so any lingering imports keep resolving.
 * Prefer importing from './EmailLoginStep' directly.
 */
export {
  EmailLoginStep,
  EmailLoginStep as PhoneLoginStep,
  LOGIN_EMAIL_KEY,
  LOGIN_PHONE_KEY,
  LOGIN_CHANNEL_KEY,
} from './EmailLoginStep';
