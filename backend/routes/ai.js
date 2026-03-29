const express = require('express');
const router = express.Router();

// Symptom logic mapping
const symptoms = [
    {
        keywords: ["weak", "not eating", "loss of appetite", "lethargic"],
        response: "Your pet may be experiencing fatigue or digestive issues. Monitor food intake and consult a veterinarian if symptoms persist."
    },
    {
        keywords: ["vomiting", "throwing up", "puking"],
        response: "Vomiting may indicate stomach infection or food intolerance. Ensure hydration and consult a vet if vomiting continues."
    },
    {
        keywords: ["fever", "temperature", "hot"],
        response: "Fever may indicate infection. Immediate veterinary consultation is recommended."
    },
    {
        keywords: ["diarrhea", "loose stool", "poop"],
        response: "Diarrhea may be caused by dietary issues or infection. Keep your pet hydrated and seek veterinary advice if symptoms persist."
    }
];

router.post('/diagnose', (req, res) => {
    try {
        const { message } = req.body;
        console.log(`[AI] Incoming message: "${message}"`);

        if (!message) {
            console.log(`[AI] Error: Message is required`);
            return res.status(400).json({ error: "Message is required" });
        }

        const lowerMessage = message.toLowerCase();
        let identifiedResponse = "I couldn't identify clear symptoms. Please provide more details or consult a veterinarian.";
        let matchFound = false;

        for (const s of symptoms) {
            if (s.keywords.some(keyword => lowerMessage.includes(keyword))) {
                identifiedResponse = s.response;
                matchFound = true;
                console.log(`[AI] Matched condition: ${s.keywords[0]}...`);
                break;
            }
        }

        if (!matchFound) {
            console.log(`[AI] No match found, sending fallback.`);
        }

        console.log(`[AI] Response sent: "${identifiedResponse.substring(0, 50)}..."`);
        res.json({ response: identifiedResponse });
    } catch (err) {
        console.error(`[AI] Internal error:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Seller AI Listing Assistant
router.post('/seller-assist', (req, res) => {
    try {
        const { productName, category } = req.body;
        if (!productName || !category) {
            return res.status(400).json({ error: "Product name and category are required" });
        }

        const prompts = [
            `Elevate your pet's life with our premium ${productName}. Specially curated for the ${category} category, this item blends quality with comfort.`,
            `The ultimate ${productName} is here. Guaranteed to keep your furry friends happy and healthy. A must-have in ${category}!`,
            `Upgrade your ${category} collection with this uniquely designed ${productName}. Crafted for durability and style.`
        ];

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        const catchyTitle = `${productName} - Premium ${category} Selection`;

        res.json({
            suggestion: randomPrompt,
            title: catchyTitle,
            tags: [category, "pet-care", "premium", productName.toLowerCase().replace(/\s+/g, '-')]
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
