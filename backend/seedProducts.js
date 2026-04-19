const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load env vars
dotenv.config();

console.log('MONGO_URI is:', process.env.MONGO_URI);

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const mockProducts = [
    // Food
    { name: "Premium Core Diet Dog Food", category: "food", price: 45.99, description: "High-protein, grain-free dry dog food formulated for optimal health and shiny coats. Ideal for active adult dogs.", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=60", stock: 50 },
    { name: "Royal Canin Kitten Starter", category: "food", price: 38.50, description: "Veterinary-grade nutrition for kittens aged 1–4 months. Supports immune system, brain development, and healthy growth.", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=60", stock: 75 },
    { name: "Grain-Free Wet Cat Food (12 Pack)", category: "food", price: 29.99, description: "Premium pate-style wet food with real salmon and tuna. No artificial colors or preservatives. High moisture for urinary health.", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=60", stock: 100 },
    { name: "Puppy Growth Formula", category: "food", price: 42.00, description: "Specially balanced puppy formula with DHA for brain development and calcium for strong bones. All breeds up to 12 months.", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop&q=60", stock: 60 },
    { name: "Senior Dog Soft Bites (Chicken)", category: "food", price: 22.00, description: "Easy-to-chew soft treats for senior dogs. Enriched with omega-3, antioxidants, and CoQ10 for heart and joint support.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=60", stock: 90 },

    // Toys
    { name: "Interactive Enrichment Treat Puzzle", category: "toys", price: 24.50, description: "Keep your pet mentally stimulated for hours with this durable, non-toxic puzzle toy. Great for both dogs and cats.", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=60", stock: 120 },
    { name: "Organic Catnip Blend (50g)", category: "toys", price: 12.00, description: "100% natural, highly potent organic catnip sourced from peak-harvest crops. Guaranteed to drive your feline crazy.", image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop&q=60", stock: 85 },
    { name: "Chew-Resistant Rope Tug Toy", category: "toys", price: 15.99, description: "Ultra-durable braided cotton rope toy for powerful chewers. Promotes dental health and interactive bonding play.", image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&auto=format&fit=crop&q=60", stock: 140 },
    { name: "Feather Wand Cat Teaser", category: "toys", price: 9.99, description: "Retractable wand with colorful feathers and crinkle ball. Stimulates natural hunting instincts and promotes exercise.", image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&auto=format&fit=crop&q=60", stock: 200 },
    { name: "Squeaky Plush Dog Toy Set (3pc)", category: "toys", price: 19.99, description: "Set of 3 adorable plush toys with built-in squeakers. Safe, non-toxic materials. Perfect for gentle chewers and puppies.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=60", stock: 95 },

    // Health
    { name: "Advanced Joint Health Chews", category: "health", price: 35.00, description: "Veterinarian-formulated glucosamine and chondroitin chews to support mobility and joint health in aging pets.", image: "https://plus.unsplash.com/premium_photo-1664112065840-7e615e478ce1?w=800&auto=format&fit=crop&q=60", stock: 200 },
    { name: "Probiotic Digestive Health Powder", category: "health", price: 28.50, description: "Daily probiotic supplement to promote a healthy gut flora and immune system. Easy to sprinkle over wet or dry food.", image: "https://plus.unsplash.com/premium_photo-1661771746617-e94019faabbf?w=800&auto=format&fit=crop&q=60", stock: 150 },
    { name: "Omega-3 Fish Oil Capsules (90ct)", category: "health", price: 32.00, description: "Pure wild-caught salmon oil capsules. Promotes a healthy, shiny coat, reduces inflammation, and supports heart health.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60", stock: 180 },
    { name: "Pet Dental Water Additive", category: "health", price: 16.99, description: "Simply add to your pet's drinking water to fight bad breath, reduce tartar buildup, and support overall oral hygiene.", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60", stock: 220 },
    { name: "Calming Anxiety Relief Treats", category: "health", price: 24.99, description: "Natural chamomile and L-theanine infused treats to reduce stress from thunderstorms, travel, and separation anxiety.", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=60", stock: 130 },
    { name: "Flea & Tick Prevention Collar (8 months)", category: "health", price: 49.99, description: "Waterproof adjustable collar that repels and kills fleas, ticks, and mosquitoes for up to 8 months. Safe for pets and families.", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=60", stock: 75 },

    // Accessories
    { name: "Orthopedic Memory Foam Pet Bed", category: "accessories", price: 89.99, description: "Luxury memory foam bed designed to relieve body aches, joint pain, hip dysplasia, and arthritis. Medium size (30x20\").", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=60", stock: 30 },
    { name: "Retractable Dog Leash (5m)", category: "accessories", price: 27.99, description: "Ergonomic handle with one-button brake and lock. 5-metre nylon tape for freedom without compromising safety.", image: "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=800&auto=format&fit=crop&q=60", stock: 65 },
    { name: "Stainless Steel Auto Water Fountain", category: "accessories", price: 54.99, description: "2.5L capacity circulating water fountain with triple filtration. Encourages hydration and reduces urinary tract issues.", image: "https://images.unsplash.com/photo-1621153836213-89c8d7c3ed0d?w=800&auto=format&fit=crop&q=60", stock: 45 },
    { name: "Reflective Safety Pet Harness", category: "accessories", price: 34.99, description: "No-pull design with padded chest plate and reflective stitching for night walks. Adjustable for all dog sizes.", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=60", stock: 80 },
    { name: "Collapsible Travel Food Bowl Set", category: "accessories", price: 14.99, description: "Set of 2 BPA-free silicone bowls that fold flat for easy carry. Perfect for hikes, car trips, and outdoor adventures.", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=60", stock: 160 },

    // Grooming
    { name: "Deshedding Grooming Glove", category: "grooming", price: 18.99, description: "Gentle massage glove with silicone tips that removes loose fur, reduces shedding by 90%, and your pet will love the massage.", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=60", stock: 110 },
    { name: "Oatmeal Anti-Itch Pet Shampoo", category: "grooming", price: 21.50, description: "pH-balanced formula with colloidal oatmeal and aloe vera. Soothes dry, itchy skin and leaves coat soft and fresh.", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=60", stock: 95 },
    { name: "Professional Nail Clippers with Guard", category: "grooming", price: 23.99, description: "Precision stainless steel blades with a safety guard to prevent over-cutting. Includes a nail file and LED safety light.", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60", stock: 70 },
    { name: "Pet Ear Cleaning Solution (120ml)", category: "grooming", price: 13.50, description: "Gentle, alcohol-free formula that removes wax, debris, and odors. Prevents ear infections and soothing for sensitive ears.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60", stock: 125 }
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
