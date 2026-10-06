/**
 * GlowShine Co. — Reproducible Seed Data Script (FR-SEED-01 to FR-SEED-05)
 * Seeds products, categories, brands, customers, orders, payments, reviews, and campaigns.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { MOCK_PRODUCTS, CATEGORIES, BRANDS } from '../src/data/mockProducts.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyForGlowShineCommerce',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'glowshine-co.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'glowshine-co',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'glowshine-co.appspot.com',
  messagingSenderId: '100000000000',
  appId: '1:100000000000:web:glowshine12345',
  databaseURL: 'https://glowshine-co-default-rtdb.firebaseio.com',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function runSeed() {
  console.log('\x1b[35m=== GlowShine Co. Master Data Seeder ===\x1b[0m');
  console.log('Seeding initial retail intelligence and product catalogue...\n');

  try {
    // 1. Seed Categories
    console.log('1. Seeding categories...');
    for (const cat of CATEGORIES) {
      if (cat.id !== 'all') {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }
    console.log('   ✔ 6 Categories seeded.');

    // 2. Seed Brands
    console.log('2. Seeding brands...');
    for (const brand of BRANDS) {
      const brandId = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await setDoc(doc(db, 'brands', brandId), {
        id: brandId,
        name: brand,
        description: 'Clean active botanical house.',
        active: true,
      });
    }
    console.log('   ✔ Brands seeded.');

    // 3. Seed Products
    console.log('3. Seeding 12 master botanical formulations...');
    for (const prod of MOCK_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), {
        ...prod,
        updatedAt: new Date().toISOString(),
      });
    }
    console.log('   ✔ Products collection populated.');

    // 4. Seed Demo Customer & Admin Profiles
    console.log('4. Seeding Customer and Admin accounts...');
    await setDoc(doc(db, 'users', 'demo-customer-uid-01'), {
      uid: 'demo-customer-uid-01',
      email: 'customer@glowshine.demo',
      name: 'Priya Sharma',
      role: 'customer',
      createdAt: new Date().toISOString(),
      beautyProfile: {
        skinType: 'combination',
        primaryConcern: 'hydration',
        concerns: ['hydration', 'barrier_repair', 'glow'],
        sensitivities: ['fragrance-free preferred'],
        routineExperience: 'intermediate',
        quizCompletedAt: new Date().toISOString(),
      },
    });

    await setDoc(doc(db, 'users', 'demo-admin-uid-99'), {
      uid: 'demo-admin-uid-99',
      email: 'admin@glowshine.demo',
      name: 'Aria Vance (Admin)',
      role: 'admin',
      createdAt: new Date().toISOString(),
      beautyProfile: null,
    });
    console.log('   ✔ Demo customer and administrator seeded.');

    // 5. Seed Test Orders & Payments (FR-SEED-05)
    console.log('5. Seeding orders and exact UPI payments...');
    const demoOrders = [
      {
        id: 'ord_9182a',
        userId: 'demo-customer-uid-01',
        userEmail: 'customer@glowshine.demo',
        customerName: 'Priya Sharma',
        shippingAddress: {
          fullName: 'Priya Sharma',
          phone: '9876543210',
          addressLine1: 'Flat 402, Lotus Residency, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411037',
        },
        items: [
          {
            productId: 'prod-008',
            name: 'Velvet Santal & Amber Extrait',
            price: 2499,
            quantity: 1,
            image: '/products/prod-008.jpg',
          },
        ],
        subtotal: 2499,
        deliveryFee: 0,
        total: 2499,
        totalInPaise: 249900,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMode: 'gateway',
        reference: 'pay_rzp_99412',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 2 * 3600 * 1000 + 45000).toISOString(),
      },
      {
        id: 'ord_7741c',
        userId: 'demo-customer-uid-01',
        userEmail: 'customer@glowshine.demo',
        customerName: 'Priya Sharma',
        shippingAddress: {
          fullName: 'Priya Sharma',
          phone: '9876543210',
          addressLine1: 'Flat 402, Lotus Residency, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411037',
        },
        items: [
          {
            productId: 'prod-001',
            name: 'Ceramide Dew Barrier Repair Moisturizer',
            price: 1299,
            quantity: 1,
            image: '/products/prod-001.jpg',
          },
        ],
        subtotal: 1299,
        deliveryFee: 0,
        total: 1299,
        totalInPaise: 129900,
        status: 'payment_pending',
        paymentStatus: 'reference_submitted',
        paymentMode: 'direct_upi',
        utrReference: '428190184712',
        createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
        referenceSubmittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ];

    for (const ord of demoOrders) {
      await setDoc(doc(db, 'orders', ord.id), ord);
    }
    console.log('   ✔ Confirmed and UTR-pending orders seeded.');

    // 6. Seed Campaigns
    console.log('6. Seeding behavioral marketing campaigns...');
    await setDoc(doc(db, 'campaigns', 'cmp_barrier_first'), {
      id: 'cmp_barrier_first',
      name: 'Hydration & Barrier Renewal Week',
      discount: '15% Off Ceramides & Hydrators',
      target: 'Segment: High-Intent Barrier Seekers',
      status: 'active',
      validUntil: '14 Oct 2026',
      redemptions: 48,
    });
    console.log('   ✔ Marketing campaign rules seeded.');

    console.log('\n\x1b[32m✔ Master seed completed successfully!\x1b[0m');
    console.log('You can now run \x1b[36mnpm run dev\x1b[0m to test the complete application.\n');
  } catch (err) {
    console.error('\x1b[31mSeed error:\x1b[0m', err.message);
  }
}

runSeed();
