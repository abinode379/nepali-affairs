export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) ?? [];
  return adminEmails.includes(email.toLowerCase());
}
