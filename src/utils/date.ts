/**
 * Formats a given date to the strict ICT (Asia/Phnom_Penh) timezone
 * as required by TRD Section 5.2.
 */
export function formatDateICT(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}