/**
 * GlowShine Co. Error Mapping
 * Translates Firebase / system error codes into friendly, non-leaky customer messages
 */

export function mapAuthError(error) {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || error.message;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 8 characters).';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':
      return ''; // User intentionally cancelled popup
    case 'auth/network-request-failed':
      return 'Connection problem. Check your internet connection and retry.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function mapFirestoreError(error) {
  if (!error) return 'Unable to load data at this time.';
  const code = error.code || error.message;

  switch (code) {
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This item already exists.';
    case 'resource-exhausted':
      return 'System is experiencing high traffic. Please try again shortly.';
    case 'unavailable':
      return 'Network service temporarily unavailable. Please retry.';
    default:
      return 'Unable to complete the request. Please try again.';
  }
}

export function mapPaymentError(error) {
  if (!error) return 'Payment processing failed.';
  const code = error.code || error.message;

  switch (code) {
    case 'PAYMENT_EXPIRED':
      return 'This payment session has expired. Please initiate checkout again.';
    case 'ORDER_NOT_FOUND':
      return 'Order not found or invalid.';
    case 'AMOUNT_MISMATCH':
      return 'Payment amount mismatch detected. Please contact support.';
    case 'UTR_ALREADY_USED':
      return 'This UTR reference has already been submitted for another order.';
    case 'INVALID_UTR_FORMAT':
      return 'UTR must be a 12-digit reference number provided by your UPI app.';
    case 'MAX_ORDER_EXCEEDED':
      return 'Order value exceeds maximum UPI limit (₹1,00,000).';
    default:
      return error.message || 'Payment verification encountered an issue. Please try again.';
  }
}
