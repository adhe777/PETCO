const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load env vars
dotenv.config();

console.log('MONGO_URI is:', process.env.MONGO_URI);

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const mockProducts = [
    {
        name: "Premium Core Diet Dog Food",
        category: "food",
        price: 45.99,
        description: "High-protein, grain-free dry dog food formulated for optimal health and shiny coats. Ideal for active adult dogs.",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=60",
        stock: 50,
        sellerId: new mongoose.Types.ObjectId() // Placeholder if required by schema, but schema doesn't strict check it if we bypass it or we can just omit if not required
    },
    {
        name: "Interactive Enrichment Treat Puzzle",
        category: "toys",
        price: 24.50,
        description: "Keep your pet mentally stimulated for hours with this durable, non-toxic puzzle toy. Great for both dogs and cats.",
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=60",
        stock: 120
    },
    {
        name: "Advanced Joint Health Chews",
        category: "health",
        price: 35.00,
        description: "Veterinarian-formulated glucosamine and chondroitin chews to support mobility and joint health in aging pets.",
        image: "https://plus.unsplash.com/premium_photo-1664112065840-7e615e478ce1?w=800&auto=format&fit=crop&q=60",
        stock: 200
    },
    {
        name: "Orthopedic Memory Foam Pet Bed",
        category: "accessories",
        price: 89.99,
        description: "Luxury memory foam bed designed to relieve body aches, joint pain, hip dysplasia, and arthritis. Medium size (30x20\").",
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=60",
        stock: 30
    },
    {
        name: "Organic Catnip Blend",
        category: "toys",
        price: 12.00,
        description: "100% natural, highly potent organic catnip sourced from peak-harvest crops. Guaranteed to drive your feline crazy.",
        image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop&q=60",
        stock: 85
    },
    {
        name: "Probiotic Digestive Health Powder",
        category: "health",
        price: 28.50,
        description: "Daily probiotic supplement to promote a healthy gut flora and immune system. Easy to sprinkle over wet or dry food.",
        image: "https://plus.unsplash.com/premium_photo-1661771746617-e94019faabbf?w=800&auto=format&fit=crop&q=60",
        stock: 150
    }
];

const seedData = async () => {
    try {
        await Product.deleteMany(); // Clear existing
        console.log('Existing products cleared');
        await Product.insertMany(mockProducts);
        console.log('Sample products seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding products:', err);
        process.exit(1);
    }
};

seedData();
