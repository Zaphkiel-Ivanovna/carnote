/**
 * Currency formatting utilities
 */

/**
 * Format number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: en-US)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}
