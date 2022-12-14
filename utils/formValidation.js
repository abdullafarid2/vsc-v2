export function verifyEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  return regex.test(email);
}

export function verifyName(name) {
  const regex = /^[a-z,.'-]{1,30}$/i;

  return regex.test(name);
}

export function verifyPhoneNumber(number) {
  const regex = /^\d{8}$/;

  return regex.test(number);
}

export function verifyPassword(password) {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  return regex.test(password);
}

export function verifyConfirmPassword(password, verifyPassowrd) {
  return password === verifyPassowrd;
}

export function verifyCpr(cpr) {
  const regex = /^\d{9}$/;

  return regex.test(cpr);
}
