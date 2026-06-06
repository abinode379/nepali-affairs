export function validateEmail(email: string) {
  const normalized = email?.trim();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Please enter a valid email address.');
  }

  return normalized;
}

export async function subscribeEmail(email: string) {
  const normalized = validateEmail(email);

  return {
    success: true,
    message: `Thanks for subscribing with ${normalized}. You will receive updates soon.`
  };
}
