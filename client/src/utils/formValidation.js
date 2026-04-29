const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getEmailError(email) {
  const value = email.trim();
  if (!value) return "Email address is required.";
  if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address, like name@example.com.";
  return "";
}

export function getPasswordError(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

export function getPhoneError(phone, { required = false } = {}) {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");

  if (!value) return required ? "Phone number is required." : "";
  if (digits.length !== 10) return "Phone number should be 10 digits.";
  return "";
}

export function getOtpError(otp) {
  if (!otp) return "Enter the 6-digit verification code.";
  if (!/^\d{6}$/.test(otp)) return "Verification code should be exactly 6 digits.";
  return "";
}

export function toFriendlyAuthError(error, fallback = "Something went wrong. Please try again.") {
  const rawMessage = typeof error === "string" ? error : error?.message;
  const message = (rawMessage || fallback).toLowerCase();

  if (message.includes("network") || message.includes("failed to fetch")) {
    return "We could not connect to the server. Please check your internet connection and try again.";
  }
  if (message.includes("email") && (message.includes("invalid") || message.includes("valid"))) {
    return "Please enter a valid email address.";
  }
  if (message.includes("password") && (message.includes("incorrect") || message.includes("wrong") || message.includes("invalid"))) {
    return "The password does not match this account.";
  }
  if (message.includes("invalid credentials") || message.includes("credential")) {
    return "The email or password is not correct.";
  }
  if (message.includes("not found") || message.includes("no user") || message.includes("does not exist")) {
    return "No account was found with this email address.";
  }
  if (message.includes("already") || message.includes("exists") || message.includes("duplicate")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (message.includes("verify") && message.includes("email")) {
    return "Please verify your email address before signing in.";
  }
  if (message.includes("otp") || message.includes("code")) {
    return "The verification code is incorrect or has expired.";
  }
  if (message.includes("admin") && message.includes("key")) {
    return "The admin secret key is not correct.";
  }
  if (message.includes("phone") || message.includes("mobile")) {
    return "Please enter a valid 10-digit phone number.";
  }

  return rawMessage || fallback;
}
