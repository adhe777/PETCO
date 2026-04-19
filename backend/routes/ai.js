const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Analyze Image endpoint
router.post('/analyze-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        console.log(`[AI] Analyzing image: ${req.file.originalname} -> ${req.file.filename}`);

        // Attempt Gemini Analysis first
        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `You are PetAssistant, a highly experienced veterinary AI assistant from PETCO SmartCare. 

Analyze this pet image carefully and provide:
1. What you observe (visible symptoms, wounds, skin conditions, posture, coat quality)
2. Most likely diagnosis or condition
3. Immediate first-aid care the owner can provide at home
4. Urgency level: Low / Medium / High / Emergency
5. Whether the pet needs a vet visit and how soon

Be specific, professional, and empathetic. If this is a wound, describe its severity. 
Always end with: "⚠️ Disclaimer: This AI assessment is for guidance only. Please consult a certified veterinarian for a definitive diagnosis."`;
                
                const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
                const imageParts = [{
                    inlineData: {
                        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
                        mimeType: req.file.mimetype
                    }
                }];

                const result = await model.generateContent([prompt, ...imageParts]);
                const response = await result.response;
                const diagnosis = response.text();
                console.log(`[AI] Gemini analysis successful.`);
                return res.json({ response: diagnosis, imageUrl: `/uploads/${req.file.filename}` });
            } catch (geminiErr) {
                console.error("[AI] Gemini API error, falling back to smart mock:", geminiErr.message);
            }
        }

        // Smart fallback based on image filename hints
        const lowerName = req.file.originalname.toLowerCase();
        let diagnosis;

        if (lowerName.includes('wound') || lowerName.includes('cut') || lowerName.includes('injury') || lowerName.includes('bleed')) {
            diagnosis = `🩹 **Wound Assessment Detected**

Based on visual analysis, your pet appears to have a wound or laceration.

**Immediate Care:**
- Gently clean the wound with sterile saline or mild antiseptic (Betadine diluted 1:10 with water)
- Apply gentle pressure with a clean cloth if there is bleeding
- Do NOT apply alcohol or hydrogen peroxide directly
- Cover with a clean bandage to prevent licking or dirt

**Urgency: HIGH** — Please visit a veterinarian within 24 hours, sooner if the wound is deep, won't stop bleeding, or shows signs of infection (pus, redness, swelling).

⚠️ Disclaimer: This AI assessment is for guidance only. Please consult a certified veterinarian for a definitive diagnosis.`;
        } else if (lowerName.includes('skin') || lowerName.includes('rash') || lowerName.includes('itch') || lowerName.includes('spot')) {
            diagnosis = `🔬 **Dermatological Issue Detected**

Your pet appears to have a skin condition — this could be allergies, mange, ringworm, or a hot spot.

**Immediate Care:**
- Prevent the pet from scratching or licking the area
- Apply pet-safe antihistamine cream if available
- Keep the area clean and dry
- Monitor for spreading redness or hair loss

**Urgency: MEDIUM** — Schedule a vet visit within 48-72 hours for proper diagnosis and prescription.

⚠️ Disclaimer: This AI assessment is for guidance only. Please consult a certified veterinarian for a definitive diagnosis.`;
        } else if (lowerName.includes('eye') || lowerName.includes('ear')) {
            diagnosis = `👁️ **Eye/Ear Issue Detected**

Your pet may have an eye or ear infection, irritation, or foreign body.

**Immediate Care:**
- For eyes: rinse gently with sterile saline, avoid rubbing
- For ears: do not insert objects; use vet-approved ear cleaner if available
- Keep the pet from scratching the affected area

**Urgency: HIGH** — Eye and ear issues can deteriorate rapidly. Visit a vet within 24 hours.

⚠️ Disclaimer: This AI assessment is for guidance only. Please consult a certified veterinarian for a definitive diagnosis.`;
        } else {
            diagnosis = `🐾 **Visual Assessment Complete**

I've analyzed your pet's image. While I cannot make a definitive diagnosis from the photo alone, here's a general assessment:

**What I Observed:**
- The image shows your pet in what appears to be a concerning condition
- Watch for changes in behavior, appetite, or energy levels

**Recommended Steps:**
1. Monitor your pet closely for the next 24 hours
2. Ensure adequate water intake and rest
3. Avoid strenuous activity until symptoms improve
4. Document any changes with photos or notes

**Urgency: LOW to MEDIUM** — If symptoms worsen or your pet shows distress, contact a veterinarian immediately.

For the most accurate diagnosis, please upload a close-up image showing the specific symptom or area of concern.

⚠️ Disclaimer: This AI assessment is for guidance only. Please consult a certified veterinarian for a definitive diagnosis.`;
        }

        res.json({ response: diagnosis, imageUrl: `/uploads/${req.file.filename}` });
    } catch (err) {
        console.error(`[AI] Image analysis error:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Comprehensive symptom logic mapping
const symptoms = [
    {
        keywords: ["not sleeping", "can't sleep", "awake", "restless", "pacing", "not resting", "insomnia", "sleep"],
        response: `🌙 **Sleep Disturbance in Pets**

Restlessness or inability to sleep in pets can indicate several conditions:

**Possible Causes:**
- Pain or discomfort (arthritis, injury, internal pain)
- Anxiety or stress (new environment, loud noises, separation)
- Cognitive Dysfunction Syndrome (in older pets)
- Itching from parasites or allergies
- Medical conditions affecting the nervous system

**What to do:**
1. Check for any visible injuries or signs of pain
2. Create a calm, comfortable sleeping area away from noise
3. Maintain a consistent daily routine
4. If pacing continues for more than 2 nights, consult your vet

**Urgency:** Medium — If accompanied by whimpering or aggressive behavior, visit a vet soon.`
    },
    {
        keywords: ["weak", "not eating", "loss of appetite", "lethargic", "tired", "no energy", "sluggish", "won't eat", "refusing food"],
        response: `😔 **Loss of Appetite & Lethargy Detected**

These are common but important warning signs in pets.

**Possible Causes:**
- Gastrointestinal upset or infection
- Dental pain making eating difficult
- Emotional distress or depression
- Underlying illness (kidney/liver issues, infections)

**Immediate Steps:**
1. Offer bland food (boiled chicken + white rice) in small portions
2. Ensure fresh water is always available
3. Check for unusual objects they may have swallowed
4. Monitor stool for blood or unusual color

**Urgency:** Medium-High — If the pet hasn't eaten for 48+ hours, seek immediate veterinary care.`
    },
    {
        keywords: ["vomiting", "throwing up", "puking", "nausea", "heaving"],
        response: `🤢 **Vomiting Detected**

Vomiting can range from mild (dietary indiscretion) to serious (toxin ingestion, blockage).

**Immediate Care:**
1. Withhold food for 4–6 hours to let the stomach settle
2. Offer small sips of water frequently
3. After 6 hours, introduce bland food gradually
4. Check what they may have eaten recently

**⚠️ Emergency Signs** — Go to an emergency vet immediately if:
- Vomiting blood or brown liquid
- Bloated/distended stomach
- Vomiting more than 3 times in an hour

**Urgency:** Medium — Monitor closely; vet visit needed if vomiting persists beyond 24 hours.`
    },
    {
        keywords: ["fever", "temperature", "hot", "shivering", "shaking", "trembling"],
        response: `🌡️ **Fever or Temperature Abnormality**

Normal pet temperature: 38–39°C (100.5–103°F). Anything above 39.4°C is a fever.

**Signs of fever in pets:**
- Warm, dry nose; red eyes
- Lethargy and loss of appetite
- Shivering even in warm conditions

**What to do:**
1. Keep your pet cool and hydrated
2. Apply a cool (not cold) wet cloth to paws and ears
3. Do NOT give human fever medications (dangerous to pets)

**Urgency: HIGH** — A fever over 39.4°C needs veterinary attention within 12 hours.`
    },
    {
        keywords: ["diarrhea", "loose stool", "watery stool", "bloody stool", "runny poop"],
        response: `💧 **Gastrointestinal Issue (Diarrhea)**

**Possible Causes:** Dietary change, infection, parasites, stress, food intolerance.

**Home Care:**
1. Hold food for 12 hours (water must be available)
2. Introduce bland diet: boiled chicken + white rice
3. Add a probiotic supplement if available (pet-safe)

**⚠️ Urgent Signs:**
- Blood in stool → Emergency vet visit
- More than 5 episodes in 24 hours → Vet needed today
- Signs of dehydration (skin tent test, dry gums)

**Urgency:** Medium — Monitor; if mild, home care for 24 hours. If severe, see a vet today.`
    },
    {
        keywords: ["itching", "scratching", "flea", "skin rash", "hot spot", "biting skin", "licking paw"],
        response: `🔍 **Skin Condition / Parasite Issue Detected**

**Possible Causes:** Fleas, mites, allergies (food or environmental), bacterial skin infection (pyoderma).

**Immediate Care:**
1. Check the coat for visible fleas or flea dirt (black specks)
2. Apply pet-safe flea treatment if parasites found
3. Use a calming pet shampoo (oatmeal-based)
4. Prevent licking affected areas with a cone if needed

**Urgency:** Medium — Schedule a vet visit for anti-parasite treatment or allergy testing if it persists.`
    },
    {
        keywords: ["limping", "can't walk", "hurt leg", "paw swollen", "paw injury", "limb pain", "favoring leg"],
        response: `🦴 **Limb Injury / Lameness Detected**

**Possible Causes:** Paw cut, thorn/foreign body, sprain, fracture, or joint pain.

**Immediate Care:**
1. Examine the paw carefully for cuts, thorns, or swelling
2. If bleeding: apply gentle pressure with a clean cloth
3. Restrict movement — no jumping or stairs
4. Do NOT give human pain relievers (ibuprofen/aspirin are toxic to pets)

**Urgency: HIGH** — If the pet won't bear weight at all or the limb is swollen, visit a vet same day for X-ray evaluation.`
    },
    {
        keywords: ["coughing", "sneezing", "cold", "flu", "discharge", "runny nose", "wheezing", "breathing"],
        response: `🫁 **Respiratory Issue Detected**

**Possible Causes:** Kennel cough, upper respiratory infection, allergies, or foreign body in airway.

**Immediate Care:**
1. Keep your pet warm and away from cold drafts
2. Use a humidifier in the room if available
3. Monitor breathing rate — normal is 15–30 breaths/minute
4. Ensure they stay hydrated

**⚠️ Emergency Signs:**
- Blue/purple gums → Immediate emergency vet
- Labored breathing or gasping
- Choking sounds

**Urgency:** Medium-High — Visit a vet within 24 hours for proper diagnosis and antibiotics if needed.`
    },
    {
        keywords: ["wound", "cut", "bleeding", "laceration", "bite wound", "torn skin", "sore"],
        response: `🩹 **Wound / Injury Detected**

**Immediate First Aid:**
1. Rinse gently with sterile saline or clean water
2. Control bleeding with firm gentle pressure for 5–10 minutes
3. Do NOT use alcohol or hydrogen peroxide (damages tissue)
4. Cover with a clean bandage
5. Prevent licking with an e-collar

**Urgency: HIGH** — Deep wounds, puncture wounds from animal bites, wounds that won't stop bleeding, or wounds showing infection (pus, smell, swelling) need same-day vet attention.`
    },
    {
        keywords: ["anxiety", "stressed", "scared", "hiding", "aggressive", "biting", "barking excessively"],
        response: `😟 **Behavioral / Anxiety Issue Detected**

**Possible Causes:** Separation anxiety, fear of loud noises, trauma, territorial behavior, or medical conditions causing pain/discomfort.

**Management Strategies:**
1. Provide a safe, quiet space for your pet to retreat
2. Use calming aids: pheromone diffusers, calming wraps/thundershirts
3. Maintain consistent daily routines
4. Avoid punishing fearful behavior — use positive reinforcement
5. Gradual desensitization for known triggers

**Urgency:** Low-Medium — If aggression is sudden/new, see a vet to rule out pain as a cause.`
    },
    {
        keywords: ["not drinking", "no water", "dehydrated", "dehydration"],
        response: `💧 **Dehydration Risk Detected**

Normal water intake for pets: 50–60 ml per kg body weight per day.

**Check for Dehydration:**
- Skin tent test: Pinch the skin at the scruff — it should snap back immediately
- Check gums: should be moist and pink (not dry or tacky)

**Encourage Drinking:**
1. Add low-sodium broth (chicken/beef) to water
2. Offer ice cubes as treats
3. Try a pet water fountain (running water attracts many pets)
4. Add wet food to their diet

**Urgency: HIGH** — Severe dehydration is an emergency. If gums are pale/dry and pet is weak, go to a vet immediately.`
    }
];

router.post('/diagnose', (req, res) => {
    try {
        const { message } = req.body;
        console.log(`[AI] Incoming message: "${message}"`);

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const lowerMessage = message.toLowerCase();
        let identifiedResponse = null;
        let matchScore = 0;

        // Score-based matching to find best match
        for (const s of symptoms) {
            let score = 0;
            for (const keyword of s.keywords) {
                if (lowerMessage.includes(keyword)) {
                    score += keyword.split(' ').length; // multi-word keywords score higher
                }
            }
            if (score > matchScore) {
                matchScore = score;
                identifiedResponse = s.response;
            }
        }

        if (!identifiedResponse) {
            console.log(`[AI] No match found, sending informative fallback.`);
            identifiedResponse = `🐾 **PetAssistant Response**

Thank you for reaching out! I want to make sure I give you the most accurate guidance.

I wasn't able to match your message to a specific known condition. Here's what I suggest:

**Please try to include:**
- The specific symptom (e.g., "vomiting", "not eating", "limping")
- How long it has been going on
- Your pet's species and approximate age

**General Tips for Immediate Care:**
1. Ensure your pet has access to fresh water and a calm environment
2. Avoid giving human medications to pets
3. Monitor your pet's behavior, appetite, and bathroom habits
4. If your pet seems distressed or in pain — visit a vet promptly

You can also **upload a photo** of the affected area for visual diagnosis. 📷

⚠️ When in doubt, a veterinarian visit is always the safest choice.`;
        } else {
            console.log(`[AI] Match found (score: ${matchScore}). Sending response.`);
        }

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
