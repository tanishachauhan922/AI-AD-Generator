require('dotenv').config();
const mongoose = require('mongoose');

const Template = require('../models/Template');
const connectDB = require('../config/db');

const sampleTemplates = [
  {
    name: 'Sale Banner',
    category: 'Sale',
    //thumbnail: '/thumbnails/sale-banner.png',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',

    dimensions: {
      width: 1080,
      height: 1080
    },

    elements: [
      {
        type: 'headline',
        placeholder: '{{PRODUCT_NAME}} - Upto 50% OFF',
        fontSize: 48,
        color: '#FFFFFF',
        position: { x: 50, y: 100 },
        width: 900,
        height: 120
      },
      {
        type: 'image',
        slot: 'product_image',
        position: { x: 140, y: 300 },
        width: 800,
        height: 500
      },
      {
        type: 'cta',
        placeholder: 'Shop Now',
        fontSize: 32,
        color: '#FFFFFF',
        position: { x: 400, y: 900 },
        width: 280,
        height: 70
      }
    ],

    colors: {
      primary: '#FF4500',
      secondary: '#FFD700',
      background: '#1A1A1A'
    },

    isActive: true
  },
  {
  name: 'Product Launch',
  category: 'Launch',
  thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Introducing {{PRODUCT_NAME}}',
      fontSize: 52,
      color: '#FFFFFF',
      position: { x: 70, y: 100 },
      width: 940,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Discover something new',
      fontSize: 30,
      color: '#EEEEEE',
      position: { x: 70, y: 240 },
      width: 940,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 350 },
      width: 800,
      height: 400
    },
    {
      type: 'cta',
      placeholder: 'Explore Now',
      fontSize: 30,
      color: '#FFFFFF',
      position: { x: 400, y: 850 },
      width: 280,
      height: 70
    }
  ],

  colors: {
    primary: '#6C5CE7',
    secondary: '#A29BFE',
    background: '#171717'
  },

  isActive: true
},
//Festival Offer
{
  name: 'Festival Offer',
  category: 'Festival',
  thumbnail: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: '{{FESTIVAL_NAME}} SALE',
      fontSize: 56,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Get Flat {{DISCOUNT}}% OFF',
      fontSize: 36,
      color: '#FFD700',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 370 },
      width: 800,
      height: 400
    },
    {
      type: 'cta',
      placeholder: 'Shop Now',
      fontSize: 32,
      color: '#FFFFFF',
      position: { x: 400, y: 870 },
      width: 280,
      height: 70
    }
  ],

  colors: {
    primary: '#E74C3C',
    secondary: '#F1C40F',
    background: '#2C1A1A'
  },

  isActive: true
},
//Diwali Royal Gold Promo
{
  name: 'Diwali Royal Gold Promo',
  category: 'Festival',
  thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Diwali Special Offer',
      fontSize: 52,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Celebrate with Flat {{DISCOUNT}}% OFF',
      fontSize: 32,
      color: '#FFD700',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 360 },
      width: 800,
      height: 400
    },
    {
      type: 'cta',
      placeholder: 'Shop Now',
      fontSize: 32,
      color: '#FFFFFF',
      position: { x: 400, y: 870 },
      width: 280,
      height: 70
    }
  ],

  colors: {
    primary: '#D97706',
    secondary: '#FFD700',
    background: '#24120A'
  },

  isActive: true
},
//3. IPL Match Day Special Offer
{
  name: 'IPL Match Day Special Offer',
  category: 'Sale',
  thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Match Day Special Offer',
      fontSize: 50,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Big Match. Big Savings.',
      fontSize: 32,
      color: '#FFFFFF',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 360 },
      width: 800,
      height: 400
    },
    {
      type: 'cta',
      placeholder: 'Grab Offer',
      fontSize: 32,
      color: '#FFFFFF',
      position: { x: 400, y: 870 },
      width: 280,
      height: 70
    }
  ],

  colors: {
    primary: '#2563EB',
    secondary: '#F97316',
    background: '#07152F'
  },

  isActive: true
},

//4. Monsoon Fitness Challenge
{
  name: 'Monsoon Fitness Challenge 30-Day',
  category: 'Health & Fitness',
  thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: '30-Day Fitness Challenge',
      fontSize: 50,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Transform Your Body This Monsoon',
      fontSize: 30,
      color: '#CCFBF1',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 350 },
      width: 800,
      height: 420
    },
    {
      type: 'cta',
      placeholder: 'Join Challenge',
      fontSize: 30,
      color: '#FFFFFF',
      position: { x: 390, y: 870 },
      width: 300,
      height: 70
    }
  ],

  colors: {
    primary: '#14B8A6',
    secondary: '#06B6D4',
    background: '#042F2E'
  },

  isActive: true
},
//5. South Indian Wedding & Jewellery Festive
{
  name: 'South Indian Wedding & Jewellery Festive',
  category: 'Festival',
  thumbnail: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Wedding Collection',
      fontSize: 52,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Traditional Elegance, Timeless Beauty',
      fontSize: 30,
      color: '#FFD700',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 360 },
      width: 800,
      height: 400
    },
    {
      type: 'cta',
      placeholder: 'Explore Collection',
      fontSize: 30,
      color: '#FFFFFF',
      position: { x: 360, y: 870 },
      width: 360,
      height: 70
    }
  ],

  colors: {
    primary: '#EC4899',
    secondary: '#F59E0B',
    background: '#3B161F'
  },

  isActive: true
},
//6. Foodie UGC Reels
{
  name: 'Foodie UGC Reels - 15 Min Delivery',
  category: 'Food & Dining',
  thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Hungry? We Got You!',
      fontSize: 52,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Fresh food delivered in 15 minutes',
      fontSize: 30,
      color: '#FFFFFF',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 350 },
      width: 800,
      height: 420
    },
    {
      type: 'cta',
      placeholder: 'Order Now',
      fontSize: 32,
      color: '#FFFFFF',
      position: { x: 400, y: 870 },
      width: 280,
      height: 70
    }
  ],

  colors: {
    primary: '#EF4444',
    secondary: '#F97316',
    background: '#2A0A0A'
  },

  isActive: true
},
//7. B2B SaaS Growth Calculator
{
  name: 'B2B SaaS Growth Calculator',
  category: 'Tech & SaaS',
  thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',

  dimensions: {
    width: 1080,
    height: 1080
  },

  elements: [
    {
      type: 'headline',
      placeholder: 'Grow Your Business Faster',
      fontSize: 50,
      color: '#FFFFFF',
      position: { x: 60, y: 100 },
      width: 960,
      height: 130
    },
    {
      type: 'subheadline',
      placeholder: 'Calculate your potential ROI',
      fontSize: 30,
      color: '#C4B5FD',
      position: { x: 60, y: 250 },
      width: 960,
      height: 80
    },
    {
      type: 'image',
      slot: 'product_image',
      position: { x: 140, y: 350 },
      width: 800,
      height: 420
    },
    {
      type: 'cta',
      placeholder: 'Calculate Now',
      fontSize: 30,
      color: '#FFFFFF',
      position: { x: 380, y: 870 },
      width: 320,
      height: 70
    }
  ],

  colors: {
    primary: '#8B5CF6',
    secondary: '#6366F1',
    background: '#111827'
  },

  isActive: true
},

];

async function seed() {
  try {
    await connectDB();

   for (const template of sampleTemplates) {
  const existingTemplate = await Template.findOne({
    name: template.name
  });

 if (existingTemplate) {
  existingTemplate.thumbnail = template.thumbnail;
  await existingTemplate.save();

  
} else {
  await Template.create(template);
}
}

    console.log('Templates seeded!');
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();