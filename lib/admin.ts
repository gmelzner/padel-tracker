const ADMIN_EMAILS = [
  "gusmelzner@gmail.com",
  "rodrigo@producenegro.com.ar",
];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
