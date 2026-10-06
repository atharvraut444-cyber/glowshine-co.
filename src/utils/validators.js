/**
 * GlowShine Co. Input Validators
 */

/**
 * Validate 12-digit Indian Bank UTR (Unique Transaction Reference)
 * @param {string} utr
 * @returns {boolean}
 */
export function validateUtr(utr) {
  if (!utr || typeof utr !== 'string') return false;
  const clean = utr.trim();
  // Standard Indian banking UTR is 12 digits (numeric)
  return /^\d{12}$/.test(clean);
}

/**
 * Validate standard 10-digit Indian mobile number
 * @param {string} phone
 * @returns {boolean}
 */
export function validateIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s-+]/g, '');
  return /^[6-9]\d{9}$/.test(clean);
}

/**
 * Validate 6-digit Indian PIN code
 * @param {string} pincode
 * @returns {boolean}
 */
export function validatePincode(pincode) {
  if (!pincode || typeof pincode !== 'string') return false;
  const clean = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(clean);
}

/**
 * Validate standard email format
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validate checkout shipping address
 */
export function validateAddress(address) {
  const errors = {};
  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name';
  }
  if (!address.phone || !validateIndianPhone(address.phone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number';
  }
  if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
    errors.addressLine1 = 'Please enter a valid street address';
  }
  if (!address.city || address.city.trim().length < 2) {
    errors.city = 'Please enter your city';
  }
  if (!address.state || address.state.trim().length < 2) {
    errors.state = 'Please enter your state';
  }
  if (!address.pincode || !validatePincode(address.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit PIN code';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
