/** Build a wa.me link. `number` is digits only, with country code (e.g. "917046537191"). */
export function whatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(e164: string): string {
  return `tel:${e164}`;
}
