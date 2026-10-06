import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { MOCK_PRODUCTS, calculateProductMatch } from '../../data/mockProducts';

// In-memory product catalogue cache to prevent redundant Firestore queries
// Initialized with master catalogue for instant 0ms Frame-1 render
let cachedRawProducts = [...MOCK_PRODUCTS];
let rawProductsPromise = null;
let cacheTimestamp = Date.now();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const isDemoMode =
  !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoKey');
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

async function fetchRawProducts() {
  const now = Date.now();
  if (cachedRawProducts && cachedRawProducts.length > 0 && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedRawProducts;
  }

  // If in demo mode without active emulators, return curated catalogue with 0ms network delay
  if (isDemoMode && !useEmulators) {
    if (!cachedRawProducts || cachedRawProducts.length === 0) {
      cachedRawProducts = [...MOCK_PRODUCTS];
    }
    return cachedRawProducts;
  }

  // Deduplicate concurrent in-flight requests
  if (rawProductsPromise) {
    return rawProductsPromise;
  }

  rawProductsPromise = (async () => {
    let list = [];
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('active', '==', true), limit(50));
      // Race with 1200ms timeout so network issues never freeze the UI for 30s
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 1200)
      );
      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);

      if (!snapshot.empty) {
        list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
      }
    } catch (err) {
      console.warn('[ProductService] Using curated catalogue:', err.message);
    }

    if (list.length === 0) {
      list = [...MOCK_PRODUCTS];
    }

    cachedRawProducts = list;
    cacheTimestamp = Date.now();
    rawProductsPromise = null;
    return list;
  })();

  return rawProductsPromise;
}

export const productService = {
  /**
   * Clear in-memory product cache (e.g. after admin updates)
   */
  clearCache() {
    cachedRawProducts = null;
    cacheTimestamp = 0;
    rawProductsPromise = null;
  },

  /**
   * Fetch list of products with filters and sorting
   */
  async getProducts({
    category = 'all',
    skinType = 'all',
    concern = 'all',
    brand = 'all',
    search = '',
    sortBy = 'featured',
    maxResults = 40,
    beautyProfile = null,
  } = {}) {
    try {
      const rawList = await fetchRawProducts();
      let productsList = [...rawList];

      // Compute dynamic GlowMatch score for each product
      productsList = productsList.map((p) => ({
        ...p,
        glowMatchScore: calculateProductMatch(p, beautyProfile),
      }));

      // Apply client-side filters
      let filtered = productsList.filter((product) => {
        // Category filter
        if (category && category !== 'all' && product.category !== category) {
          return false;
        }

        // Skin Type filter
        if (skinType && skinType !== 'all') {
          if (!product.skinTypes || (!product.skinTypes.includes('all') && !product.skinTypes.includes(skinType))) {
            return false;
          }
        }

        // Concern filter
        if (concern && concern !== 'all') {
          if (!product.concerns || !product.concerns.includes(concern)) {
            return false;
          }
        }

        // Brand filter
        if (brand && brand !== 'all' && product.brand !== brand) {
          return false;
        }

        // Search filter (name, description, ingredients, brand)
        if (search && search.trim()) {
          const q = search.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchIng = product.ingredients && product.ingredients.some((i) => i.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc && !matchIng) {
            return false;
          }
        }

        return true;
      });

      // Apply Sorting
      if (sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'match') {
        filtered.sort((a, b) => b.glowMatchScore - a.glowMatchScore);
      } else if (sortBy === 'newest') {
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else {
        // default: featured / bestsellers first
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      }

      return { products: filtered, total: filtered.length, error: null };
    } catch (error) {
      console.error('[ProductService.getProducts] Error:', error);
      return { products: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length, error: error.message };
    }
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id, beautyProfile = null) {
    try {
      // 1. Check in-memory cached catalogue first (instant 0ms response)
      if (cachedRawProducts) {
        const foundInCache = cachedRawProducts.find((p) => p.id === id);
        if (foundInCache) {
          return {
            product: {
              ...foundInCache,
              glowMatchScore: calculateProductMatch(foundInCache, beautyProfile),
            },
            error: null,
          };
        }
      }

      // 2. Otherwise attempt Firestore fetch (with timeout guard)
      if (!isDemoMode || useEmulators) {
        try {
          const docRef = doc(db, 'products', id);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1200)
          );
          const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
          if (docSnap.exists()) {
            const product = { id: docSnap.id, ...docSnap.data() };
            return {
              product: {
                ...product,
                glowMatchScore: calculateProductMatch(product, beautyProfile),
              },
              error: null,
            };
          }
        } catch (e) {
          console.warn('[ProductService] Local fallback for ID:', id);
        }
      }

      // 3. Fallback to local catalogue
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      if (found) {
        return {
          product: {
            ...found,
            glowMatchScore: calculateProductMatch(found, beautyProfile),
          },
          error: null,
        };
      }

      return { product: null, error: 'Product not found' };
    } catch (error) {
      return { product: null, error: error.message };
    }
  },

  /**
   * Fetch bestsellers / trending products
   */
  async getTrending(limitCount = 4, beautyProfile = null) {
    const { products } = await this.getProducts({ maxResults: 12, beautyProfile });
    return products.filter((p) => p.isBestseller).slice(0, limitCount);
  },

  /**
   * Fetch top personalized matches for current user
   */
  async getPersonalizedMatches(beautyProfile, limitCount = 4) {
    const { products } = await this.getProducts({ sortBy: 'match', beautyProfile });
    return products.slice(0, limitCount);
  }
};
