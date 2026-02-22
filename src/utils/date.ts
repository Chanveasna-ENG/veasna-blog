/**
 * Formats a given date strictly into the ICT (Phnom Penh) timezone.
 * Enforces server/client consistency to prevent hydration errors.
 * * @param {Date | string} dateInput - The date to format.
 * @returns {string} The formatted date string (e.g., "26 October 2023 at 14:05:30").
 */
export function formatDateICT(dateInput: Date | string): string {
  if (!dateInput) return '';

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date input provided to formatDateICT: ${dateInput}`);
  }

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // `en-GB` normally outputs "26 October 2023, 14:05:30".
  // We replace the comma to match the TRD requirement ("at").
  return formatter.format(date).replace(',', ' at');
}