// Indian Rupee & Number Formatting Utilities for RPS Admin Panel

/**
 * Formats a number into Indian Rupee format (e.g. 1164746 -> ₹11,64,746)
 */
export function formatINR(amount, includeSymbol = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0';
  }

  const num = Math.round(Number(amount));
  const isNegative = num < 0;
  const absStr = Math.abs(num).toString();

  let result = '';
  if (absStr.length <= 3) {
    result = absStr;
  } else {
    const lastThree = absStr.substring(absStr.length - 3);
    const otherNumbers = absStr.substring(0, absStr.length - 3);
    const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${withCommas},${lastThree}`;
  }

  const prefix = isNegative ? '-' : '';
  const symbol = includeSymbol ? '₹' : '';
  return `${prefix}${symbol}${result}`;
}

/**
 * Compact Indian currency format (e.g. 2450000 -> ₹24.5L, 85000 -> ₹85K)
 */
export function formatCompactINR(amount, includeSymbol = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0';
  }

  const num = Number(amount);
  const symbol = includeSymbol ? '₹' : '';

  if (Math.abs(num) >= 10000000) {
    return `${symbol}${(num / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `${symbol}${(num / 100000).toFixed(2)} L`;
  }
  if (Math.abs(num) >= 1000) {
    return `${symbol}${(num / 1000).toFixed(1)} K`;
  }
  return `${symbol}${num}`;
}

export default {
  formatINR,
  formatCompactINR,
};
