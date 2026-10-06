import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';

// Unique session ID for current browser session
const SESSION_ID = 'ses_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// Allowed client event types per Security Rules
const ALLOWED_EVENTS = new Set([
  'page_view',
  'search',
  'category_view',
  'product_view',
  'wishlist_add',
  'wishlist_remove',
  'cart_add',
  'cart_remove',
  'checkout_start',
  'review_submit',
  'quiz_complete',
  'routine_create',
  'recommendation_click',
  'offer_click',
]);

/**
 * Fire-and-forget behaviour tracker complying strictly with Firestore security rules
 */
export async function trackEvent({
  eventType,
  productId = null,
  category = null,
  query = null,
  value = null,
  meta = {},
}) {
  try {
    const user = auth.currentUser;
    // Behaviour events in Firestore security rules require signed-in user
    if (!user) return;

    if (!ALLOWED_EVENTS.has(eventType)) {
      console.warn(`[BehaviourTracker] Event type "${eventType}" is not allowed by security rules.`);
      return;
    }

    const payload = {
      userId: user.uid,
      eventType,
      productId: productId || null,
      category: category || null,
      query: query || null,
      value: typeof value === 'number' ? value : null,
      meta: meta || {},
      sessionId: SESSION_ID,
      timestamp: serverTimestamp(),
    };

    // Asynchronous fire-and-forget write
    addDoc(collection(db, 'behaviourEvents'), payload).catch((err) => {
      // Intentionally swallowed: analytics failure must never interrupt customer shopping
      console.warn('[BehaviourTracker] Event write suppressed:', err.message);
    });
  } catch (err) {
    // Suppress error
    console.warn('[BehaviourTracker] Tracking exception:', err.message);
  }
}
