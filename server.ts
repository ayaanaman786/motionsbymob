import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format. Expected 'messages' array." });
      }

      // Lazy-load Gemini SDK and verify the key exists
      const ai = getGenAI();

      // Convert client messages to Gemini structure
      const contents = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `You are the lead cinematic consultant and creative producer for "Motions by MOB", an ultra-high-end boutique creative syndicate and digital archive.

CORE IDENTITY & ETHOS:
- Motions by MOB does NOT shoot commercial ads. We create unyielding, permanent visual archives of pure automotive presence.
- Our primary focus is on clean luxury SUV culture, pristine factory proportions, and understated OEM+ design systems.
- Our signature style revolves around "Quiet Authority", "Understated Power", "Silent Dominance", and a cinematic, brutalist aesthetic.
- We aggressively reject cheap visual stunts, chaotic noise, attention-seeking modifications, and racing decals.
- We have a massive digital footprint, boasting over 6M+ views and 700K+ likes.
- Our founder and lead director is Mohib. 

SERVICES & COLLABORATIONS:
- We undertake strategic collaborations, custom creative direction, and high-fidelity video curation projects.
- Our clientele includes luxury brands, heritage syndicates, and premium vehicle collectors.
- To book or coordinate, clients are directed to our direct dispatch channels: WhatsApp (+92 310 6552666), Instagram (@motionsbymob), or encrypted mail (mobicoby@gmail.com).

YOUR PERSONA & TONE:
- You communicate with supreme professionalism, elegance, and cool composure. 
- Speak concisely, clearly, and authoritatively. You sound like a master luxury watchmaker, an industrial designer, or a high-end coachbuilder describing their craft.
- AVOID generic greeting hype, excessive exclamation marks, emojis, or cheesy sales pitches. Do not act like a generic AI assistant. You are an elite cinematic consultant.

YOUR DIRECTIVES:
- Assist the user in planning bespoke automotive films, discussing vehicle aesthetics, visual composition, camera setups (mechanical focus pulling, lens aberrations, cinematic lighting, depth-of-field), and OEM+ styling.
- Defend the brand's minimalist, brutalist aesthetic. If a user asks for chaotic edits, racing decals, or cheap stunts, politely but firmly explain why Motions by MOB refuses to compromise on factory-designed power and clean luxury.
- Always remain strictly in-character as the premium MOB creative producer.`,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Route Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during text generation." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
