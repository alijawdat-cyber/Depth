// Currency formatting utilities for Iraqi Dinar (IQD)

/**
 * Format amount in Iraqi Dinar with thousands separator
 * @param amount - Amount in IQD
 * @returns Formatted string like "12,345 IQD"
 */
export function formatIQD(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 IQD';
  }
  
  return new Intl.NumberFormat('en-US').format(Math.round(amount)) + ' IQD';
}

/**
 * Format amount as currency without denomination
 * @param amount - Amount to format
 * @returns Formatted string like "12,345"
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(Math.round(amount));
}
