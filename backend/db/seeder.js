const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const shoes = [
  {
    name: 'Air Max 270',
    brand: 'Nike',
    price: 150,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'The Nike Air Max 270 is a stylish shoe with the tallest Air Max heel unit for a supersoft ride.',
    category: 'Running',
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Red/Black',
    stock: 10
  },
  {
    name: 'Ultraboost 22',
    brand: 'Adidas',
    price: 180,
    image: 'https://images.unsplash.com/photo-1587563877366-267f5660882e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Adidas Ultraboost 22 shoes offer incredible energy return and comfort with each and every step.',
    category: 'Running',
    sizes: [6, 7, 8, 9, 10, 11],
    color: 'Core Black',
    stock: 15
  },
  {
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    price: 60,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'The Chuck Taylor All Star is the most iconic sneaker in the world, recognized for its unmistakable silhouette.',
    category: 'Casual',
    sizes: [5, 6, 7, 8, 9, 10, 11, 12],
    color: 'White',
    stock: 20
  },
  {
    name: 'Yeezy Boost 350 V2',
    brand: 'Yeezy',
    price: 220,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Designed by Kanye West, the Yeezy Boost 350 V2 features a primeknit upper and signature boost cushioning.',
    category: 'Lifestyle',
    sizes: [7, 8, 9, 10, 11],
    color: 'Zebra',
    stock: 5
  },
  {
    name: 'Old Skool',
    brand: 'Vans',
    price: 65,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Classic skate shoe with the iconic side stripe, durable canvas and suede uppers, and waffle outsoles.',
    category: 'Skate',
    sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    color: 'Black/White',
    stock: 25
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoestore');
    await Product.deleteMany({});
    await Product.insertMany(shoes);
    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
