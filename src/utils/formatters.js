/**
 * GlowShine Co. Utility Formatters
 */

/**
 * Format currency in Indian Rupees (INR)
 * @param {number} amount - Price amount
 * @param {boolean} [isPaise=false] - Whether amount is in paise (1 INR = 100 paise)
 * @returns {string} Formatted currency string (e.g. "₹1,499")
 */
export function formatCurrency(amount, isPaise = false) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const rupees = isPaise ? Math.round(amount / 100) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format integer paise into displayable Rupee value
 */
export function paiseToRupees(paise) {
  if (!paise || isNaN(paise)) return 0;
  return Math.round(paise / 100);
}

/**
 * Format Rupee amount to integer paise
 */
export function rupeesToPaise(rupees) {
  if (!rupees || isNaN(rupees)) return 0;
  return Math.round(rupees * 100);
}

/**
 * Format a Date or Firestore Timestamp into an editorial readable date string
 * @param {Date|number|{toDate: Function}} timestamp
 * @param {boolean} [includeTime=false]
 * @returns {string}
 */
export function formatDate(timestamp, includeTime = false) {
  if (!timestamp) return '—';
  
  let date;
  if (typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return '—';

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

/**
 * Format percentage or match score (e.g. 94%)
 */
export function formatScore(score) {
  if (score === undefined || score === null) return '0%';
  const num = Math.min(100, Math.max(0, Math.round(score)));
  return `${num}%`;
}

/**
 * SEC-17 Compliance: Mask UPI ID for UI presentation (e.g., "g***e@upi")
 */
export function maskUpiId(upiId) {
  if (!upiId || typeof upiId !== 'string') return '';
  const parts = upiId.split('@');
  if (parts.length !== 2) return upiId;
  const username = parts[0];
  const handle = parts[1];
  if (username.length <= 2) return `${username}***@${handle}`;
  return `${username[0]}***${username[username.length - 1]}@${handle}`;
}

/**
 * SEC-17 Compliance: Mask UTR reference number (e.g., "********4812")
 */
export function maskUtr(utr) {
  if (!utr || typeof utr !== 'string') return '';
  if (utr.length <= 4) return utr;
  const lastFour = utr.slice(-4);
  return '•'.repeat(Math.max(4, utr.length - 4)) + lastFour;
}

/**
 * Optimize image URL (especially Unsplash CDN) for precise dimensions and modern web formats
 * @param {string} url - Original image URL
 * @param {number} [width=400] - Desired width in pixels
 * @param {number} [quality=75] - Compression quality (1-100)
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, width = 400, quality = 75) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('images.unsplash.com')) {
    try {
      const u = new URL(url);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('w', width.toString());
      u.searchParams.set('q', quality.toString());
      return u.toString();
    } catch {
      return url;
    }
  }
  return url;
}

