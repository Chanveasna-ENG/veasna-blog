/**
 * Formats a date to the specific ICT (Indochina Time) string required by the Architect.
 * Format: "26 October 2023 at 14:05:30"
 * Timezone: Asia/Phnom_Penh
 */
export function formatDateICT(dateInput: Date | string | number): string {
  const date = new Date(dateInput);

  // Early return for invalid dates to prevent runtime crashes
  if (isNaN(date.getTime())) {
    console.error(`Invalid date passed to formatDateICT: ${dateInput}`);
    return 'Invalid Date';
  }

  return (
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date) + ' (ICT)'
  ); // Appending timezone explicitly for clarity if needed, or remove per design strictness
}

/**
 * Helper to ensure the format matches "Day Month Year at Hour:Minute:Second"
 * The Intl API above returns "26 October 2023, 14:05:30" (en-GB standard).
 * We strictly replace the comma to match the TRD requirement "at".
 */
export function formatStrictICT(dateInput: Date | string | number): string {
  const standardFormat = formatDateICT(dateInput);
  // Replace the default comma separator with " at "
  return standardFormat.replace(', ', ' at ');
}
