/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format difficulty for display (capitalize first letter)
 */
export function formatDifficulty(difficulty: string | null | undefined): string {
  if (!difficulty) return '';
  return capitalize(difficulty);
}


